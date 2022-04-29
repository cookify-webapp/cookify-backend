import express from 'express';

import { getIngredientTypes } from '@controllers/ingredientsController';

const ingredientRouter = express.Router();

ingredientRouter.get('/types', getIngredientTypes);

export default ingredientRouter;
