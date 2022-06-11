import { RequestHandler } from 'express';
import _ from 'lodash';

import { Recipe } from '@models/recipe';
import { Account } from '@models/account';
import { CookingMethod } from '@models/type';

import createRestAPIError from '@error/createRestAPIError';

export const getRecipeList: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;
    const ingredients = req.query?.ingredientId as string[];
    const method = req.query?.methodId as string;

    const account = await Account.findOne()
      .setOptions({ autopopulate: false })
      .byName(res.locals.username)
      .select('bookmark')
      .exec();

    const recipes = await Recipe.listRecipe(page, perPage, searchWord, ingredients, method, account?.bookmark);

    if (_.size(recipes.docs) > 0 || recipes.totalDocs > 0) {
      res.status(200).send({
        recipes: recipes.docs,
        page: recipes.page,
        perPage: recipes.limit,
        totalCount: recipes.totalDocs,
        totalPages: recipes.totalPages,
      });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    return next(err);
  }
};

export const getCookingMethods: RequestHandler = async (_req, res, next) => {
  try {
    const cookingMethods = await CookingMethod.find().exec();
    if (!cookingMethods) return res.status(204).send();

    res.status(200).send({ cookingMethods });
  } catch (err) {
    return next(err);
  }
};

export const getRecipeDetail: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.recipeId;

    const recipe = await Recipe.getRecipeDetail(id);
    if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

    const account = await Account.findOne()
      .setOptions({ autopopulate: false })
      .byName(res.locals.username)
      .select('username bookmark')
      .exec();

    recipe.averageRating = parseFloat(_.meanBy(recipe.comments, 'rating').toFixed(1));
    recipe.isMe = account?.username === recipe.author.username;
    recipe.bookmarked = _.includes(account?.bookmark, recipe._id);

    res.status(200).send({ recipe });
  } catch (err) {
    return next(err);
  }
};
