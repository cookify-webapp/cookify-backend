import express from 'express';

import { getAllAccounts } from '@controllers/accountController';
import { adminAuth } from '@middleware/auth';

const accountRouter = express.Router();

accountRouter.get('/list', adminAuth, getAllAccounts);

export default accountRouter;
