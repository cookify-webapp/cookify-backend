import express from 'express';

import { seedAccount, seedCookingMethod, seedIngredientType } from '@utils/seedUtil';

const seedRouter = express.Router();

seedRouter.get('/', seedAccount(true), seedCookingMethod(true), seedIngredientType());

seedRouter.get('/accounts', seedAccount());

seedRouter.get('/ingredients/types', seedIngredientType());

seedRouter.get('/recipes/methods', seedCookingMethod());

export default seedRouter;
