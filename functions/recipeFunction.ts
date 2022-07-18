import _ from 'lodash';
import { Types, AggregatePaginateResult, AnyObject } from 'mongoose';

import { RecipeInstanceInterface, RecipeModelInterface } from '@models/recipe';

export const listRecipe: (
  this: RecipeModelInterface,
  page: number,
  perPage: number,
  query: {
    name?: string;
    method?: string;
    ingredients?: string[] | '';
    bookmark?: Types.ObjectId[];
    allergy?: Types.ObjectId[];
  },
  author?: Types.ObjectId[]
) => Promise<AggregatePaginateResult<RecipeInstanceInterface>> = async function (
  page,
  perPage,
  { name = '', method = '', ingredients = [], bookmark = [], allergy = [] },
  author = []
) {
  const match: AnyObject = {
    $and: [{ name: { $regex: name, $options: 'i' } }, { 'ingredients.ingredient': { $nin: allergy } }],
  };
  method && match.$and.push({ method: new Types.ObjectId(method) });
  _.size(ingredients) &&
    match.$and.push({ 'ingredients.ingredient': { $all: _.map(ingredients, (item) => new Types.ObjectId(item)) } });
  _.size(author) && match.$and.push({ author: { $in: author } });

  const aggregate = this.aggregate<RecipeInstanceInterface>()
    .match(match)
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
    .unwind(
      {
        path: '$method',
        preserveNullAndEmptyArrays: true,
      },
      {
        path: '$author',
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
          bookmarked: { $in: ['$_id', bookmark] },
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

  return this.aggregatePaginate(aggregate, {
    page: page,
    limit: perPage,
    sort: '-createdAt',
  });
};
