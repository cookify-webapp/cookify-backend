import { model, Schema, Document, Types, PaginateModel, PaginateResult } from 'mongoose';

//---------------------
//   INTERFACE
//---------------------
export interface IngredientInterface extends Document {
  _id: Types.ObjectId;
  name: string;
  queryKey: string;
  unit: Types.ObjectId;
  type: Types.ObjectId;
  image?: string;
  shopUrl?: string;
  // nutritionalDetail: Object;
}

export interface IngredientInstanceMethods {
  // declare any instance methods here
}

export interface IngredientInstanceInterface extends IngredientInterface, IngredientInstanceMethods {}

export interface IngredientModelInterface extends PaginateModel<IngredientInstanceInterface, IngredientQueryHelpers> {
  // declare any static methods here
  listAll(
    page: number,
    perPage: number,
    searchWord: string,
    type: string
  ): Promise<PaginateResult<IngredientInstanceInterface>>;

  findSameType(type: string): Promise<IngredientInstanceInterface[]>;
}

interface IngredientQueryHelpers {}

//---------------------
//   SCHEMA
//---------------------
export const ingredientSchema = new Schema<
  IngredientInstanceInterface,
  IngredientModelInterface,
  IngredientInstanceMethods,
  IngredientQueryHelpers
>({
  name: { type: String, required: true, unique: true },
  queryKey: { type: String, required: true, unique: true },
  unit: { type: 'ObjectId', ref: 'Unit', required: true, autopopulate: true },
  type: {
    type: 'ObjectId',
    ref: 'IngredientType',
    required: true,
    autopopulate: true,
  },
  image: String,
  shopUrl: String,
});

//---------------------
//   MODEL
//---------------------
export const Ingredient = model<IngredientInstanceInterface, IngredientModelInterface>('Ingredient', ingredientSchema);
