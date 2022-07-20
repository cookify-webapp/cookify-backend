import express from 'express';

import { getMe, login, register, registerAdmin } from '@controllers/accountController';
import { auth } from '@middleware/auth';
import { registerValidator, loginValidator } from '@middleware/requestValidator';

const indexRouter = express.Router();

indexRouter.get('/me', auth, getMe);

indexRouter.post('/login', loginValidator, login);

indexRouter.post('/register', registerValidator, register);

indexRouter.post('/register/admin/:uniqueKey', registerValidator, registerAdmin);

export default indexRouter;
