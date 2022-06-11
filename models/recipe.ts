import { model, Schema, Document, Types, AggregatePaginateModel, AggregatePaginateResult } from 'mongoose';

import { CommentInstanceInterface } from '@models/comment';
import { AccountInterface } from '@models/account';
import { TypeInterface } from '@models/type';
import { IngredientInterface, ingredientSchema } from '@models/ingredient';
import { listRecipe } from '@functions/recipeFunction';
import constraint from '@config/constraint';

//---------------------
//   INTERFACE
//---------------------
export interface IngredientQuantityInterface {
  _id: Types.ObjectId;
  ingredient: Types.ObjectId & IngredientInterface;
  quantity: number;
}

export interface RecipeInterface extends Document {
  _id: Types.ObjectId;
  name: string;
  desc: string;
  serving: number;
  ingredients: Types.DocumentArray<IngredientQuantityInterface>;
  subIngredients: Types.Array<Types.ObjectId> & Types.DocumentArray<IngredientInterface>;
  method: Types.ObjectId & TypeInterface;
  steps: Types.Array<string>;
  image: string;
  author: Types.ObjectId & AccountInterface;
  comments?: Types.DocumentArray<CommentInstanceInterface>;
  countComment?: number;
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
    name: string,
    ingredients: string[],
    method: string,
    bookmark: Types.ObjectId[]
  ) => Promise<AggregatePaginateResult<RecipeInstanceInterface>>;
}

interface RecipeQueryHelpers {}

//---------------------
//   SCHEMA
//---------------------
export const ingredientQuantitySchema = new Schema<IngredientQuantityInterface>({
  ingredient: { type: 'ObjectId', ref: 'Ingredient', required: true, autopopulate: { select: 'name unit' } },
  quantity: { type: Number, required: true, min: 0 },
});

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
    subIngredients: [ingredientSchema],
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
      autopopulate: { select: 'username' },
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
//   MODEL
//---------------------
export const Recipe = model<RecipeInstanceInterface, RecipeModelInterface>('Recipe', recipeSchema);
