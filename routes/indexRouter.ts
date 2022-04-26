import express from 'express';

import { getMe, login, register } from '@controllers/accountController';
import { auth } from '@middleware/auth';

const indexRouter = express.Router();

indexRouter.get('/login', login);

indexRouter.post('/register', register);

indexRouter.get('/me', auth, getMe);

export default indexRouter;
