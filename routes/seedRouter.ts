import express from 'express';

import { seedAccount } from '@controllers/accountController';

const seedRouter = express.Router();

seedRouter.get('/accounts', seedAccount);

export default seedRouter;
