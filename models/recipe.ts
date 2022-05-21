import {
  model,
  Schema,
  Document,
  Types,
  QueryWithHelpers,
  AggregatePaginateModel,
  AggregatePaginateResult,
} from 'mongoose';

import { CommentInstanceInterface } from '@models/comment';
import { RatingInstanceInterface } from '@models/rating';
import { getRecipeDetail, listRecipe } from '@functions/recipeFunction';

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
  desc: string;
  ingredients: Types.DocumentArray<IngredientQuantityInterface>;
  methods: Types.Array<Types.ObjectId>;
  types: Types.Array<Types.ObjectId>;
  image: string;
  author: Types.ObjectId;
  likedBy: Types.Array<Types.ObjectId>;
  ratings?: Types.DocumentArray<RatingInstanceInterface>;
  comments?: Types.DocumentArray<CommentInstanceInterface>;
  countRating?: number;
  countComment?: number;
  averageRating?: number;
  updatedAt: Date;
  nutritionalDetail: Object;
}

export interface AverageCountInterface {
  _id: string;
  average: number;
  count: number;
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
    methods: string[]
  ) => Promise<AggregatePaginateResult<RecipeInstanceInterface>>;

  getRecipeDetail: (id: string) => Promise<RecipeInstanceInterface | null>;
}

interface RecipeQueryHelpers {
  byName(
    this: QueryWithHelpers<any, RecipeInstanceInterface, RecipeQueryHelpers>,
    name: string
  ): QueryWithHelpers<RecipeInstanceInterface, RecipeInstanceInterface, RecipeQueryHelpers>;
}

//---------------------
//   SCHEMA
//---------------------
export const ingredientQuantitySchema = new Schema<IngredientQuantityInterface>({
  ingredient: { type: 'ObjectId', ref: 'Ingredient', required: true },
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
    desc: { type: String, required: true, maxlength: 500 },
    ingredients: [{ type: ingredientQuantitySchema, required: true }],
    methods: [
      {
        type: 'ObjectId',
        ref: 'CookingMethod',
        required: true,
        autopopulate: true,
      },
    ],
    types: [
      {
        type: 'ObjectId',
        ref: 'RecipeType',
        required: true,
        autopopulate: true,
      },
    ],
    image: { type: String, required: true },
    author: {
      type: 'ObjectId',
      ref: 'Account',
      required: true,
      autopopulate: { select: 'username' },
    },
    likedBy: [{ type: 'ObjectId', ref: 'Account' }],
    nutritionalDetail: {}
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
recipeSchema.query.byName = function (
  name: string
): QueryWithHelpers<RecipeInstanceInterface, RecipeInstanceInterface, RecipeQueryHelpers> {
  return this.where({ name });
};

//---------------------
//   STATICS
//---------------------
recipeSchema.statics.listRecipe = listRecipe;
recipeSchema.statics.getRecipeDetail = getRecipeDetail;

//---------------------
//   VIRTUAL
//---------------------
recipeSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'post',
});

recipeSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

recipeSchema.virtual('countRating', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

recipeSchema.virtual('countComment', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

//---------------------
//   MODEL
//---------------------
export const Recipe = model<RecipeInstanceInterface, RecipeModelInterface>('Recipe', recipeSchema);
