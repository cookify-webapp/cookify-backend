import express from 'express';

import {
  seedAccount,
  seedCookingMethod,
  seedIngredient,
  seedIngredientType,
  seedUnit,
  seedImage,
} from '@utils/seedUtil';

const seedRouter = express.Router();

seedRouter.get(
  '/',
  seedImage('accounts'),
  seedAccount(true),
  seedCookingMethod(true),
  seedUnit(true),
  seedIngredientType(true),
  seedImage('ingredients'),
  seedIngredient()
);

seedRouter.get('/accounts', seedImage('accounts'), seedAccount());

seedRouter.get('/ingredients', seedImage('ingredients'), seedIngredient());

seedRouter.get('/ingredients/types', seedIngredientType());

seedRouter.get('/ingredients/units', seedUnit());

seedRouter.get('/recipes/methods', seedCookingMethod());

export default seedRouter;
