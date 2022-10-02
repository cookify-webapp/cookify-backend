import express, { RequestHandler } from 'express';

import {
  seedAccount,
  seedCookingMethod,
  seedIngredient,
  seedIngredientType,
  seedUnit,
  seedRecipe,
  seedAccountImages,
  seedRecipeImages,
  seedIngredientImages,
} from '@utils/seedUtil';

const sendMessage: RequestHandler = async (_req, res, next) => {
  try {
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

const seedRouter = express.Router();

seedRouter.get(
  '/',
  seedAccount,
  seedAccountImages,
  seedCookingMethod,
  seedUnit,
  seedIngredientType,
  seedRecipe,
  seedRecipeImages,
  seedIngredient,
  seedIngredientImages,
  sendMessage
);

seedRouter.get('/accounts', seedAccount, seedAccountImages, sendMessage);

seedRouter.get('/ingredients', seedIngredient, seedIngredientImages, sendMessage);

seedRouter.get('/ingredients/types', seedIngredientType, sendMessage);

seedRouter.get('/ingredients/units', seedUnit, sendMessage);

seedRouter.get('/recipes', seedRecipe, seedRecipeImages, sendMessage);

seedRouter.get('/recipes/methods', seedCookingMethod, sendMessage);

seedRouter.get('/images/accounts', seedAccountImages, sendMessage);

export default seedRouter;
