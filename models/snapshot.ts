import { model, Schema, Model, Document, Types, QueryWithHelpers } from 'mongoose';

import { RecipeInstanceInterface } from '@models/recipe';
import { dateTimeNowTz } from '@utils/dateTime';

//---------------------
//   INTERFACE
//---------------------
export interface SnapshotInterface extends Document {
  _id: Types.ObjectId;
  caption: string;
  image: string;
  author: Types.ObjectId;
  recipe: Types.ObjectId;
  likedBy: Types.Array<Types.ObjectId>;
  updatedAt: Date;
}

export interface SnapshotInstanceMethods {
  // declare any instance methods here
}

export interface SnapshotInstanceInterface extends SnapshotInterface, SnapshotInstanceMethods {}

export interface SnapshotModelInterface extends Model<SnapshotInstanceInterface, SnapshotQueryHelpers> {
  // declare any static methods here
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
    caption: { type: String, required: true },
    image: { type: String, required: true },
    author: {
      type: 'ObjectId',
      ref: 'Account',
      required: true,
      autopopulate: { select: 'username image' },
    },
    recipe: {
      type: 'ObjectId',
      ref: 'Recipe',
      required: true,
      autopopulate: { select: 'name' },
    },
    likedBy: [{ type: 'ObjectId', ref: 'Account' }],
    updatedAt: { type: Date, required: true, default: dateTimeNowTz },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//---------------------
//   QUERY HELPERS
//---------------------
snapshotSchema.query.byRecipe = function (
  recipeId: string | Types.ObjectId
): QueryWithHelpers<SnapshotInstanceInterface, SnapshotInstanceInterface, SnapshotQueryHelpers> {
  return this.where({ recipe: recipeId });
};

snapshotSchema.query.byRecipeName = function (
  name: string
): QueryWithHelpers<any, SnapshotInstanceInterface, SnapshotQueryHelpers> {
  return this.populate<{ recipe: RecipeInstanceInterface }>({
    path: 'recipe',
    match: { name },
    select: 'name -_id',
  });
};

//---------------------
//   VIRTUAL
//---------------------
snapshotSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

//---------------------
//   MODEL
//---------------------
export const Snapshot = model<SnapshotInstanceInterface, SnapshotModelInterface>('Snapshot', snapshotSchema);
