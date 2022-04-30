import express from 'express';

import { setBookmark } from '@controllers/accountController';
import { getCookingMethods } from '@controllers/recipeController';
import { auth } from '@middleware/auth';

const recipeRouter = express.Router();

recipeRouter.get('/methods', getCookingMethods);

recipeRouter.put('/:recipeId/bookmark', auth, setBookmark);

export default recipeRouter;
