import {
  model,
  Schema,
  Document,
  Types,
  QueryWithHelpers,
  AggregatePaginateModel,
  AggregatePaginateResult,
} from 'mongoose';

import { RecipeInstanceInterface } from '@models/recipe';
import { AccountInstanceInterface } from '@models/account';
import constraint from '@config/constraint';
import { listAll } from '@functions/snapshotFunction';

//---------------------
//   INTERFACE
//---------------------
export interface SnapshotInterface extends Document {
  _id: Types.ObjectId;
  caption: string;
  image: string;
  imageName: string;
  author: Pick<AccountInstanceInterface, '_id' | 'username' | 'image'>;
  recipe: Pick<RecipeInstanceInterface, '_id' | 'name'>;
  isMe?: boolean;
  isHidden: boolean;
  createdAt: Date;
}

export interface SnapshotInstanceMethods {
  // declare any instance methods here
}

export interface SnapshotInstanceInterface extends SnapshotInterface, SnapshotInstanceMethods {}

export interface SnapshotModelInterface extends AggregatePaginateModel<SnapshotInstanceInterface> {
  // declare any static methods here
  listAll(
    this: SnapshotModelInterface,
    page: number,
    perPage: number,
    username: string
  ): Promise<AggregatePaginateResult<SnapshotInstanceInterface>>;
}

interface SnapshotQueryHelpers {
  byRecipe(
    this: QueryWithHelpers<any, SnapshotInstanceInterface, SnapshotQueryHelpers>,
    recipeId: string | Types.ObjectId
  ): QueryWithHelpers<SnapshotInstanceInterface, SnapshotInstanceInterface, SnapshotQueryHelpers>;
  byRecipeName(
    this: QueryWithHelpers<any, SnapshotInstanceInterface, SnapshotQueryHelpers>,
    name: string
  ): QueryWithHelpers<any, SnapshotInstanceInterface, SnapshotQueryHelpers>;
}

//---------------------
//   SCHEMA
//---------------------
export const snapshotSchema = new Schema<
  SnapshotInstanceInterface,
  SnapshotModelInterface,
  SnapshotInstanceMethods,
  SnapshotQueryHelpers
>(
  {
    caption: { type: String, required: true, maxlength: constraint.caption.max },
    image: { type: String, required: true },
    imageName: { type: String, required: true },
    author: { type: { _id: 'ObjectId', username: String, image: String }, required: true },
    recipe: { type: { _id: 'ObjectId', name: String }, required: true },
    isHidden: { type: Boolean, required: true, default: false },
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production',
    collation: { locale: 'th' },
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

//---------------------
//   STATICS
//---------------------
snapshotSchema.statics.listAll = listAll;

//---------------------
//   QUERY HELPERS
//---------------------
snapshotSchema.query.byRecipe = function (
  recipeId: string | Types.ObjectId
): QueryWithHelpers<SnapshotInstanceInterface, SnapshotInstanceInterface, SnapshotQueryHelpers> {
  return this.where({ 'recipe._id': recipeId });
};

snapshotSchema.query.byRecipeName = function (
  name: string
): QueryWithHelpers<any, SnapshotInstanceInterface, SnapshotQueryHelpers> {
  return this.where({ 'recipe.name': name });
};

//---------------------
//   VIRTUAL
//---------------------
snapshotSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  match: { type: 'Snapshot' },
});

//---------------------
//   MODEL
//---------------------
export const Snapshot = model<SnapshotInstanceInterface, SnapshotModelInterface>('Snapshot', snapshotSchema);
