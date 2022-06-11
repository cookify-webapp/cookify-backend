import express from 'express';

import { setBookmark } from '@controllers/accountController';
import { getRecipeList, getCookingMethods } from '@controllers/recipeController';
import { auth } from '@middleware/auth';
import { recipeListValidator } from '@middleware/requestValidator';

const recipeRouter = express.Router();

recipeRouter.get('/list', recipeListValidator, getRecipeList);

recipeRouter.get('/methods', getCookingMethods);

recipeRouter.put('/:recipeId/bookmark', auth, setBookmark);

export default recipeRouter;
