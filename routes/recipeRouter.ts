import express from 'express';

import { setBookmark } from '@controllers/accountController';
import { getRecipeList, getCookingMethods, createRecipe, getRecipeDetail } from '@controllers/recipeController';
import { auth, byPassAuth } from '@middleware/auth';
import { recipeListValidator, recipeValidator } from '@middleware/requestValidator';
import imageUtil from '@utils/imageUtil';
import bodyParser from '@middleware/bodyParser';

const middleware = [auth, imageUtil.single('recipeImage'), bodyParser, recipeValidator];

const recipeRouter = express.Router();

recipeRouter.get('/list', byPassAuth, recipeListValidator, getRecipeList);

recipeRouter.get('/methods', getCookingMethods);

recipeRouter.get('/:recipeId', byPassAuth, getRecipeDetail);

recipeRouter.post('/create', middleware, createRecipe);

recipeRouter.put('/:recipeId/bookmark', auth, setBookmark);

export default recipeRouter;
