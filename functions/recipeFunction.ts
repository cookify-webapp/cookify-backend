import _ from 'lodash';
import { Types, AggregatePaginateResult, AnyObject } from 'mongoose';

import { RecipeInstanceInterface, RecipeModelInterface } from '@models/recipe';

const genericListRecipe: (
  model: RecipeModelInterface,
  page: number,
  perPage: number,
  match: AnyObject
) => Promise<AggregatePaginateResult<RecipeInstanceInterface>> = async (model, page, perPage, match) => {
  const aggregate = model
    .aggregate<RecipeInstanceInterface>()
    .match(match)
    .lookup({
      from: 'cookingmethods',
      localField: 'method',
      foreignField: '_id',
      as: 'method',
    })
    .lookup({
      from: 'comments',
      localField: '_id',
      foreignField: 'post',
      as: 'ratings',
      pipeline: [{ $project: { rating: 1 } }],
    })
    .unwind(
      {
        path: '$method',
        preserveNullAndEmptyArrays: true,
      },
      {
        path: '$ratings',
        preserveNullAndEmptyArrays: true,
      }
    )
    .group({
      _id: '$_id',
      root: { $first: '$$ROOT' },
      averageRating: { $avg: '$ratings.rating' },
    })
    .replaceRoot({
      $mergeObjects: [
        '$root',
        {
          averageRating: { $ifNull: [{ $round: ['$averageRating', 1] }, 0] },
        },
      ],
    })
    .project({
      name: 1,
      method: 1,
      image: 1,
      averageRating: 1,
      author: 1,
      bookmarked: 1,
      createdAt: 1,
    });

  return model.aggregatePaginate(aggregate, {
    page: page,
    limit: perPage,
    sort: '-createdAt',
  });
};

export const listRecipeByQuery: (
  this: RecipeModelInterface,
  page: number,
  perPage: number,
  query: {
    name: string;
    method: string;
    ingredients: string[] | '';
    allergy: Types.ObjectId[];
  }
) => Promise<AggregatePaginateResult<RecipeInstanceInterface>> = async function (
  page,
  perPage,
  { name, method, ingredients, allergy }
) {
  const match: AnyObject = {
    name: { $regex: name, $options: 'i' },
    'ingredients.ingredient': { $nin: allergy },
  };
  if (method) match.method = new Types.ObjectId(method);
  if (_.size(ingredients))
    match['ingredients.ingredient'] = { $all: _.map(ingredients, (item) => new Types.ObjectId(item)) };

  return genericListRecipe(this, page, perPage, match);
};

export const listRecipeByAuthors: (
  this: RecipeModelInterface,
  page: number,
  perPage: number,
  author: Types.ObjectId[]
) => Promise<AggregatePaginateResult<RecipeInstanceInterface>> = async function (page, perPage, author) {
  return genericListRecipe(this, page, perPage, { 'author._id': { $in: author } });
};

export const listRecipeByIds: (
  this: RecipeModelInterface,
  page: number,
  perPage: number,
  only: Types.ObjectId[]
) => Promise<AggregatePaginateResult<RecipeInstanceInterface>> = async function (page, perPage, only) {
  return genericListRecipe(this, page, perPage, { _id: { $in: only } });
};
