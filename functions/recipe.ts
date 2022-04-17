import _ from "lodash";
import {
  Types,
  AggregatePaginateResult,
} from "mongoose";
import { Recipe, RecipeInstanceInterface, recipeSchema } from "@models/recipe";

//---------------------
//   STATICS
//---------------------
recipeSchema.statics.listRecipe = async function (
  page: number,
  perPage: number,
  name: string,
  ingredients: string[],
  methods: string
): Promise<AggregatePaginateResult<RecipeInstanceInterface>> {
  const aggregate = this.aggregate()
    .lookup({
      from: "cookingMethods",
      localField: "methods",
      foreignField: "_id",
      as: "methods",
    })
    .lookup({
      from: "recipeTypes",
      localField: "types",
      foreignField: "_id",
      as: "types",
    })
    .lookup({
      from: "accounts",
      localField: "author",
      foreignField: "_id",
      as: "author",
      pipeline: [{ $project: { username: 1 } }],
    })
    .match({
      $and: [
        { name: { $regex: name, $options: "i" } },
        {
          "methods._id": {
            $all: _.map(methods, (item) => new Types.ObjectId(item)),
          },
        },
        {
          "ingredients.ingredient": {
            $all: _.map(ingredients, (item) => new Types.ObjectId(item)),
          },
        },
      ],
    })
    .lookup({
      from: "ratings",
      localField: "_id",
      foreignField: "post",
      as: "ratings",
    })
    .unwind("ratings")
    .group({
      _id: "$_id",
      root: { $first: "$$ROOT" },
      ratings: { $push: "$ratings" },
      averageRating: { $avg: "$ratings.rating" },
      countRating: { $count: 1 },
    })
    .replaceRoot({
      $mergeObjects: [
        "$root",
        {
          averageRating: "$averageRating",
          countRating: "$countRating",
          ratings: "$ratings",
        },
      ],
    })
    .sort("updatedAt");

  return Recipe.aggregatePaginate(aggregate, {
    page: page,
    limit: perPage,
  });
};