import express from "express";
import { getMe, getAllAccounts } from '@controllers/accountController';
import { auth } from "@middleware/auth";

const accountRouter = express.Router();

accountRouter.get('/', getAllAccounts);

accountRouter.get('/me', auth, getMe);

export default accountRouter;