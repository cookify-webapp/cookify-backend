import { model, Schema, Document, Types, AggregatePaginateModel, AggregatePaginateResult } from 'mongoose';

import { CommentInstanceInterface } from '@models/comment';
import { AccountInstanceInterface } from '@models/account';
import { TypeInstanceInterface } from '@models/type';
import { IngredientInstanceInterface } from '@models/ingredient';
import { listRecipe } from '@functions/recipeFunction';
import constraint from '@config/constraint';
import { UnitInstanceInterface } from './unit';

//---------------------
//   INTERFACE
//---------------------
export interface IngredientQuantityInterface {
  ingredient: Types.ObjectId & IngredientInstanceInterface;
  quantity: number;
  unit: Types.ObjectId & UnitInstanceInterface;
}

export interface RecipeInterface extends Document {
  _id: Types.ObjectId;
  name: string;
  desc: string;
  serving: number;
  ingredients: Types.DocumentArray<IngredientQuantityInterface>;
  subIngredients: Types.Array<Types.ObjectId> & Types.DocumentArray<IngredientInstanceInterface>;
  method: Types.ObjectId & TypeInstanceInterface;
  steps: Types.Array<string>;
  image: string;
  author: Types.ObjectId & AccountInstanceInterface;
  comments?: Types.DocumentArray<CommentInstanceInterface>;
  averageRating?: number;
  bookmarked?: boolean;
  isMe?: boolean;
  createdAt: Date;
  nutritionalDetail: Object;
}

export interface RecipeInstanceMethods {
  // declare any instance methods here
}

export interface RecipeInstanceInterface extends RecipeInterface, RecipeInstanceMethods {}

export interface RecipeModelInterface extends AggregatePaginateModel<RecipeInstanceInterface> {
  // declare any static methods here
  listRecipe: (
    page: number,
    perPage: number,
    query: {
      name: string;
      method: string;
      ingredients: string[] | '';
      bookmark?: Types.ObjectId[];
      allergy?: Types.ObjectId[];
    },
    author?: Types.ObjectId
  ) => Promise<AggregatePaginateResult<RecipeInstanceInterface>>;
}

interface RecipeQueryHelpers {}

//---------------------
//   SCHEMA
//---------------------
export const ingredientQuantitySchema = new Schema<IngredientQuantityInterface>(
  {
    ingredient: {
      type: 'ObjectId',
      ref: 'Ingredient',
      required: true,
      autopopulate: { select: 'name type image' },
    },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: 'ObjectId', ref: 'Unit', required: true, autopopulate: true },
  },
  { _id: false, autoIndex: false, autoCreate: false }
);

export const recipeSchema = new Schema<
  RecipeInstanceInterface,
  RecipeModelInterface,
  RecipeInstanceMethods,
  RecipeQueryHelpers
>(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true, maxlength: constraint.desc.max },
    serving: { type: Number, required: true, min: 1 },
    ingredients: [{ type: ingredientQuantitySchema, required: true }],
    subIngredients: [
      { type: 'ObjectId', ref: 'Ingredient', autopopulate: { select: 'name unit type image' }, excludeIndexes: true },
    ],
    method: {
      type: 'ObjectId',
      ref: 'CookingMethod',
      required: true,
      autopopulate: true,
    },
    steps: [{ type: String, required: true }],
    image: { type: String, required: true },
    author: {
      type: 'ObjectId',
      ref: 'Account',
      required: true,
      autopopulate: { select: 'username image' },
    },
    nutritionalDetail: {},
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production',
    collation: { locale: 'th' },
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

//---------------------
//   STATICS
//---------------------
recipeSchema.statics.listRecipe = listRecipe;

//---------------------
//   VIRTUALS
//---------------------
recipeSchema.virtual('comments', {
  localField: '_id',
  foreignField: 'post',
  ref: 'Comment',
});

//---------------------
//   MODEL
//---------------------
export const Recipe = model<RecipeInstanceInterface, RecipeModelInterface>('Recipe', recipeSchema);
