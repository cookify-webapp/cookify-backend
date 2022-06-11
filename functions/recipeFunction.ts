import { Types, AggregatePaginateResult } from 'mongoose';

import { Recipe, RecipeInstanceInterface, RecipeModelInterface } from '@models/recipe';

export const listRecipe: (
  this: RecipeModelInterface,
  page: number,
  perPage: number,
  name: string,
  ingredients: string[],
  method: string,
  bookmark?: Types.Array<Types.ObjectId>
) => Promise<AggregatePaginateResult<RecipeInstanceInterface>> = async function (
  page,
  perPage,
  name,
  ingredients,
  method,
  bookmark
) {
  const aggregate = this.aggregate<RecipeInstanceInterface>()
    .match({
      $and: [
        { name: { $regex: name, $options: 'i' } },
        { method },
        { 'ingredients.ingredient': { $all: ingredients } },
      ],
    })
    .lookup({
      from: 'cookingmethods',
      localField: 'method',
      foreignField: '_id',
      as: 'method',
    })
    .lookup({
      from: 'accounts',
      localField: 'author',
      foreignField: '_id',
      as: 'author',
      pipeline: [{ $project: { username: 1 } }],
    })
    .lookup({
      from: 'comments',
      localField: '_id',
      foreignField: 'post',
      as: 'ratings',
      pipeline: [{ $project: { rating: 1 } }],
    })
    .unwind('ratings')
    .group({
      _id: '$_id',
      root: { $first: '$$ROOT' },
      averageRating: { $avg: '$ratings.rating' },
    })
    .replaceRoot({
      $mergeObjects: [
        '$root',
        {
          averageRating: { $round: ['$averageRating', 1] },
          bookmarked: { $in: ['$_id', bookmark || []] },
        },
      ],
    });

  return Recipe.aggregatePaginate(aggregate, {
    page: page,
    limit: perPage,
    select: 'name methods image averageRating author bookmarked',
    sort: '-createdAt',
  });
};

export const getRecipeDetail: (this: RecipeModelInterface, id: string) => Promise<RecipeInstanceInterface | null> =
  async function (id) {
    return this.findById(id)
      .populate('ratings')
      .populate('comments')
      .populate('countComment')
      .sort('-createdAt')
      .exec();
  };
