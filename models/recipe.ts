import _ from "lodash";
import {
  model,
  Schema,
  Document,
  Types,
  QueryWithHelpers,
  AggregatePaginateModel,
  AggregatePaginateResult,
} from "mongoose";

//---------------------
//   INTERFACE
//---------------------
export interface IngredientQuantityInterface {
  _id: Types.ObjectId;
  ingredient: Types.ObjectId;
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

export interface AverageCountInterface {
  _id: string;
  average: number;
  count: number;
}

export interface RecipeInstanceMethods {
  // declare any instance methods here
}

export interface RecipeInstanceInterface
  extends RecipeInterface,
    RecipeInstanceMethods {}

export interface RecipeModelInterface
  extends AggregatePaginateModel<RecipeInstanceInterface> {
  // declare any static methods here
  listRecipe(
    page: number,
    perPage: number,
    name: string,
    ingredients: string[],
    method: string
  ): Promise<AggregatePaginateResult<RecipeInstanceInterface>>;
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
  ingredient: { type: "ObjectId", ref: "Ingredient", required: true },
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
//   STATICS
//---------------------
recipeSchema.statics.listRecipe = async function (
  page: number,
  perPage: number,
  name: string,
  ingredients: string[],
  method: string
): Promise<AggregatePaginateResult<RecipeInstanceInterface>> {
  const aggregate = this.aggregate([
    {
      $match: {
        $and: [
          { name: { $regex: name, $options: "i" } },
          { method: new Types.ObjectId(method) },
          {
            ingredients: {
              $all: _.map(ingredients, (item) => new Types.ObjectId(item)),
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "post",
        as: "ratings",
      },
    },
    {
      $group: {
        _id: "$_id",
        average: { $avg: "$ratings.rating" },
        count: { $count: "$ratings.rating" },
      },
    },
  ]);

  return Recipe.aggregatePaginate(aggregate, {
    page: page,
    limit: perPage,
  });
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
