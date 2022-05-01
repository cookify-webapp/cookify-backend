import express from 'express';

import { getMe, login, register } from '@controllers/accountController';
import { auth } from '@middleware/auth';

const indexRouter = express.Router();

indexRouter.get('/me', auth, getMe);

indexRouter.post('/login', login);

indexRouter.post('/register', register);

export default indexRouter;
