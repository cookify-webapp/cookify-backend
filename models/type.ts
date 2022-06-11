import { model, Schema, Model, Document, Types } from 'mongoose';

//---------------------
//   INTERFACE
//---------------------
export interface TypeInterface extends Document {
  _id: Types.ObjectId;
  name: string;
}

export interface TypeInstanceMethods {
  // declare any instance methods here
}

export interface TypeInstanceInterface extends TypeInterface, TypeInstanceMethods {}

export interface TypeModelInterface extends Model<TypeInstanceInterface, TypeQueryHelpers> {
  // declare any static methods here
}

interface TypeQueryHelpers {}

//---------------------
//   SCHEMA
//---------------------
const typeSchema = new Schema<TypeInstanceInterface, TypeModelInterface, TypeInstanceMethods, TypeQueryHelpers>(
  {
    name: { type: String, required: true, unique: true },
  },
  { autoCreate: process.env.NODE_ENV !== 'production', collation: { locale: 'th' }, versionKey: false }
);

//---------------------
//   MODEL
//---------------------
export const IngredientType = model<TypeInstanceInterface, TypeModelInterface>('IngredientType', typeSchema);

export const CookingMethod = model<TypeInstanceInterface, TypeModelInterface>('CookingMethod', typeSchema);
