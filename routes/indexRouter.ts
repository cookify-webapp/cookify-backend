import express from 'express';

import { getMe, login, register, registerAdmin } from '@controllers/accountController';
import { auth } from '@middleware/auth';
import { registerValidator, loginValidator, genericListValidator } from '@middleware/requestValidator';
import { listNotification } from '@controllers/notificationController';
import { getFollowingRecipeAndSnapshot } from '@controllers/recipeController';

const indexRouter = express.Router();

indexRouter.get('/me', auth, getMe);

indexRouter.get('/notifications', auth, listNotification);

indexRouter.get('/following', auth, genericListValidator, getFollowingRecipeAndSnapshot);

indexRouter.post('/login', loginValidator, login);

indexRouter.post('/register', registerValidator, register);

indexRouter.post('/register/admin/:uniqueKey', registerValidator, registerAdmin);

export default indexRouter;
