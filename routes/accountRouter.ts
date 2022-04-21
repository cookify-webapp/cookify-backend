import express from 'express';

import { getMe, getAllAccounts } from '@controllers/accountController';
import { auth, adminAuth } from '@middleware/auth';

const accountRouter = express.Router();

accountRouter.get('/', adminAuth, getAllAccounts);

accountRouter.get('/me', auth, getMe);

export default accountRouter;
