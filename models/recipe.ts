import {
  model,
  Schema,
  Model,
  Document,
  Types,
  QueryWithHelpers,
} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

//---------------------
//   INTERFACE
//---------------------
export interface IngredientQuantityInterface {
  _id: Types.ObjectId;
  ingredient: string;
  quantity: number;
}

export interface RecipeInterface extends Document {
  _id: Types.ObjectId;
  name: string;
  ingredients: Types.DocumentArray<IngredientQuantityInterface>;
  method: Types.ObjectId;
  types: Types.Array<Types.ObjectId>;
  image?: string;
  author: Types.ObjectId;
  likedBy: Types.Array<Types.ObjectId>;
  updatedAt: Date;
  // nutritionalDetail: Object;
}

export interface RecipeInstanceMethods {
  // declare any instance methods here
}

export interface RecipeInstanceInterface
  extends RecipeInterface,
    RecipeInstanceMethods {}

export interface RecipeModelInterface
  extends Model<RecipeInstanceInterface, RecipeQueryHelpers> {
  // declare any static methods here
}

interface RecipeQueryHelpers {
  byName(
    this: QueryWithHelpers<any, RecipeInstanceInterface, RecipeQueryHelpers>,
    name: string
  ): QueryWithHelpers<
    RecipeInstanceInterface,
    RecipeInstanceInterface,
    RecipeQueryHelpers
  >;
}

//---------------------
//   SCHEMA
//---------------------
const ingredientQuantitySchema = new Schema<IngredientQuantityInterface>({
  ingredient: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
});

const recipeSchema = new Schema<
  RecipeInstanceInterface,
  RecipeModelInterface,
  RecipeInstanceMethods,
  RecipeQueryHelpers
>(
  {
    name: { type: String, required: true, unique: true },
    ingredients: [{ type: ingredientQuantitySchema, required: true }],
    method: {
      type: "ObjectId",
      ref: "CookingMethod",
      required: true,
      autopopulate: true,
    },
    types: [
      {
        type: "ObjectId",
        ref: "RecipeType",
        required: true,
        autopopulate: true,
      },
    ],
    image: String,
    author: {
      type: "ObjectId",
      ref: "Account",
      required: true,
      autopopulate: { select: "username image" },
    },
    likedBy: [{ type: "ObjectId", ref: "Account" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { updatedAt: true, createdAt: false },
  }
);

//---------------------
//   QUERY HELPERS
//---------------------
recipeSchema.query.byName = function (
  name: string
): QueryWithHelpers<
  RecipeInstanceInterface,
  RecipeInstanceInterface,
  RecipeQueryHelpers
> {
  return this.where({ name });
};

//---------------------
//   VIRTUAL
//---------------------
recipeSchema.virtual("ratings", {
  ref: "Rating",
  localField: "_id",
  foreignField: "post",
});

recipeSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

//---------------------
//   PLUGIN
//---------------------
recipeSchema.plugin(mongooseAutoPopulate);

//---------------------
//   MODEL
//---------------------
export const Recipe = model<RecipeInstanceInterface, RecipeModelInterface>(
  "Recipe",
  recipeSchema
);

export const IngredientQuantity = model<IngredientQuantityInterface>(
  "IngredientQuantity",
  ingredientQuantitySchema
);
