import {
  model,
  Schema,
  Model,
  Document,
  Types,
  QueryWithHelpers,
} from "mongoose";

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
  findSameType(
    this: IngredientInstanceInterface
  ): QueryWithHelpers<any, IngredientInstanceInterface, IngredientQueryHelpers>;
}

export interface IngredientInstanceInterface
  extends IngredientInterface,
    IngredientInstanceMethods {}

export interface IngredientModelInterface
  extends Model<IngredientInstanceInterface, IngredientQueryHelpers> {
  // declare any static methods here
}

interface IngredientQueryHelpers {
  byName(
    this: QueryWithHelpers<
      any,
      IngredientInstanceInterface,
      IngredientQueryHelpers
    >,
    name: string
  ): QueryWithHelpers<
    IngredientInstanceInterface,
    IngredientInstanceInterface,
    IngredientQueryHelpers
  >;
}

//---------------------
//   SCHEMA
//---------------------
const ingredientSchema = new Schema<
  IngredientInstanceInterface,
  IngredientModelInterface,
  IngredientInstanceMethods,
  IngredientQueryHelpers
>({
  name: { type: String, required: true, unique: true },
  queryKey: { type: String, required: true, unique: true },
  unit: { type: "ObjectId", ref: "Unit", required: true, autopopulate: true },
  type: {
    type: "ObjectId",
    ref: "IngredientType",
    required: true,
    autopopulate: true,
  },
  image: String,
  shopUrl: String,
});

//---------------------
//   METHODS
//---------------------
ingredientSchema.methods.findSameType = function (): QueryWithHelpers<
  IngredientInstanceInterface[],
  IngredientInstanceInterface,
  IngredientQueryHelpers
> {
  return Ingredient.find({
    type: this.type,
  });
};

//---------------------
//   QUERY HELPERS
//---------------------
ingredientSchema.query.byName = function (
  name: string
): QueryWithHelpers<
  IngredientInstanceInterface,
  IngredientInstanceInterface,
  IngredientQueryHelpers
> {
  return this.where({ name });
};

//---------------------
//   MODEL
//---------------------
export const Ingredient = model<
  IngredientInstanceInterface,
  IngredientModelInterface
>("Ingredient", ingredientSchema);
