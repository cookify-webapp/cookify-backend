import { model, Schema, Model, Document, Types } from 'mongoose';

//---------------------
//   INTERFACE
//---------------------
export interface UnitInterface extends Document {
  _id: Types.ObjectId;
  name: string;
  queryKey: string;
}

export interface UnitInstanceMethods {
  // declare any instance methods here
}

export interface UnitInstanceInterface extends UnitInterface, UnitInstanceMethods {}

export interface UnitModelInterface extends Model<UnitInstanceInterface, UnitQueryHelpers> {
  // declare any static methods here
}

interface UnitQueryHelpers {}

//---------------------
//   SCHEMA
//---------------------
const unitSchema = new Schema<UnitInstanceInterface, UnitModelInterface, UnitInstanceMethods, UnitQueryHelpers>(
  {
    name: { type: String, required: true, unique: true },
    queryKey: { type: String, required: true },
  },
  { autoCreate: false, collation: { locale: 'th' }, versionKey: false }
);

//---------------------
//   MODEL
//---------------------
export const Unit = model<UnitInstanceInterface, UnitModelInterface>('Unit', unitSchema);
