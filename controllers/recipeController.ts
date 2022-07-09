import { Types } from 'mongoose';
import { RequestHandler } from 'express';
import _ from 'lodash';

import { Recipe } from '@models/recipe';
import { Account } from '@models/account';
import { CookingMethod } from '@models/type';
import { Snapshot } from '@models/snapshot';

import createRestAPIError from '@error/createRestAPIError';
import nutritionDetailService from '@services/nutritionDetailService';
import { deleteImage } from '@utils/imageUtil';
import { RecipeInstanceInterface } from '../models/recipe';
import { Comment } from '@models/comment';

const getNutritionalDetail = async (recipe: RecipeInstanceInterface) => {
  await recipe.populate(['ingredients.ingredient', 'ingredients.unit']);
  recipe.nutritionalDetail = await nutritionDetailService.getByRecipe(
    recipe.ingredients.map((item) => ({
      name: item.ingredient.queryKey,
      quantity: item.quantity,
      unit: item.unit.queryKey,
    }))
  );
};

export const getRecipeList: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;
    const ingredients = req.query?.ingredientId as string[];
    const method = req.query?.methodId as string;

    const { bookmark, allergy } = await Account.findOne()
      .setOptions({ autopopulate: false })
      .byName(res.locals.username)
      .select('bookmark allergy')
      .exec();

    const recipes = await Recipe.listRecipe(page, perPage, searchWord, method, ingredients, bookmark, allergy);

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

    const recipe = await Recipe.findById(id).populate('comments').lean({ autopopulate: true }).exec();
    if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

    const { username, bookmark } = await Account.findOne()
      .setOptions({ autopopulate: false })
      .byName(res.locals.username)
      .select('username bookmark')
      .lean()
      .exec();

    recipe.averageRating = parseFloat(_.meanBy(recipe.comments, 'rating').toFixed(1)) || 0;
    recipe.isMe = username === recipe.author.username;
    recipe.bookmarked = _.includes(bookmark, recipe._id);

    delete recipe.comments;

    res.status(200).send({ recipe });
  } catch (err) {
    return next(err);
  }
};

export const createRecipe: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body?.data;

    const account = await Account.exists({ username: res.locals.username }).exec();

    data.image = req.file?.filename;
    data.author = account?._id;

    const recipe = new Recipe(data);

    await getNutritionalDetail(recipe);

    await recipe.depopulate().save();
    res.status(200).send({ id: recipe.id });
  } catch (err) {
    return next(err);
  }
};

export const editRecipe: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.recipeId;
    const data = req.body?.data;

    const recipe = await Recipe.findById(id).setOptions({ autopopulate: false }).populate('author').exec();
    if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');
    if (recipe.author.username !== res.locals.username) throw createRestAPIError('NOT_OWNER');

    const oldImage = recipe.image;

    recipe.set({
      name: data?.name || recipe.name,
      desc: data?.desc || recipe.desc,
      method: data?.method || recipe.method,
      image: req.file?.filename || recipe.image,
      serving: data?.serving || recipe.serving,
      subIngredients: data?.subIngredients || recipe.subIngredients,
      steps: data?.steps || recipe.steps,
    });

    let isSame = false;

    if (_.size(data?.ingredients) === _.size(recipe.ingredients)) {
      const mapped = recipe.ingredients.map((item) => ({
        ingredient: item.ingredient.toString(),
        quantity: item.quantity,
        unit: item.unit.toString(),
      }));
      _.forEach(data?.ingredients, (item) => {
        isSame = _.some(mapped, item);
      });
    }

    if (!isSame) {
      recipe.set('ingredients', data?.ingredients);
      await getNutritionalDetail(recipe);
    }

    await recipe.depopulate().save({ validateModifiedOnly: true });
    recipe.image !== oldImage && deleteImage('recipes', oldImage);
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const deleteRecipe: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.recipeId;

    const ref = await Snapshot.exists({ recipe: new Types.ObjectId(id) }).exec();
    if (ref) throw createRestAPIError('DEL_REFERENCE');

    const recipe = await Recipe.findById(id).exec();
    if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');
    if (recipe.author.username !== res.locals.username) throw createRestAPIError('NOT_OWNER');

    await recipe.deleteOne();
    const comments = await Comment.find({ post: recipe._id }).exec();
    comments.forEach((comment) => comment.deleteOne());
    deleteImage('recipes', recipe.image);

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
