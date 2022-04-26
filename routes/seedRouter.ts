import express from 'express';

import { seedAccount, seedIngredientType } from '@utils/seedUtil';

const seedRouter = express.Router();

seedRouter.get('/', seedAccount(true), seedIngredientType());

seedRouter.get('/accounts', seedAccount());

seedRouter.get('/ingredients/types', seedIngredientType());

export default seedRouter;
