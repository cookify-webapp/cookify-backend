import express from 'express';

import { setBookmark } from '@controllers/accountController';
import { auth } from '@middleware/auth';

const recipeRouter = express.Router();

recipeRouter.put('/:recipeId/bookmark', auth, setBookmark);

export default recipeRouter;
