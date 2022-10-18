import { model, Schema, Document, Types, PaginateModel, PaginateResult } from 'mongoose';

import { sampleByType, listAll } from '@functions/ingredientFunction';
import { TypeInstanceInterface } from '@models/type';
import { UnitInstanceInterface } from '@models/unit';

//---------------------
//   INTERFACE
//---------------------
export interface IngredientInterface extends Document {
  _id: Types.ObjectId;
  name: string;
  queryKey: string;
  unit: Types.ObjectId & UnitInstanceInterface;
  type: Types.ObjectId & TypeInstanceInterface;
  image: string;
  imageName: string;
  shopUrl?: string;
  nutritionalDetail: any;
}

export interface IngredientInstanceMethods {
  // declare any instance methods here
}

export interface IngredientInstanceInterface extends IngredientInterface, IngredientInstanceMethods {}

export interface IngredientModelInterface extends PaginateModel<IngredientInstanceInterface, IngredientQueryHelpers> {
  // declare any static methods here
  listAll: (
    page: number,
    perPage: number,
    searchWord: string,
    type: string
  ) => Promise<PaginateResult<IngredientInstanceInterface>>;

  sampleByType: (ingredientId: string) => Promise<IngredientInstanceInterface[]>;
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
>(
  {
    name: { type: String, required: true, unique: true },
    queryKey: { type: String, required: true, unique: true },
    unit: { type: 'ObjectId', ref: 'Unit', required: true, autopopulate: true },
    type: {
      type: 'ObjectId',
      ref: 'IngredientType',
      required: true,
      autopopulate: true,
    },
    image: { type: String, required: true },
    imageName: { type: String, required: true },
    shopUrl: { type: String, default: '' },
    nutritionalDetail: {},
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production',
    collation: { locale: 'th' },
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    selectPopulatedPaths: false,
  }
);

//---------------------
//   STATICS
//---------------------
ingredientSchema.statics.listAll = listAll;
ingredientSchema.statics.sampleByType = sampleByType;

//---------------------
//   MODEL
//---------------------
export const Ingredient = model<IngredientInstanceInterface, IngredientModelInterface>('Ingredient', ingredientSchema);
