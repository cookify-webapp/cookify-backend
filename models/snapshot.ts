import { model, Schema, Model, Document, Types, QueryWithHelpers } from 'mongoose';

import { RecipeInstanceInterface } from '@models/recipe';
import constraint from '@config/constraint';

//---------------------
//   INTERFACE
//---------------------
export interface SnapshotInterface extends Document {
  _id: Types.ObjectId;
  caption: string;
  image: string;
  author: Types.ObjectId;
  recipe: Types.ObjectId;
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
    caption: { type: String, required: true, maxlength: constraint.caption.max },
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
