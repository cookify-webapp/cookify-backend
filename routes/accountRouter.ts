import express from "express";
import { getMyProfile, getAllAccounts } from '../controllers/accountController';
import { auth } from "../middleware/auth";

const accountRouter = express.Router();

accountRouter.get('/', getAllAccounts);

accountRouter.get('/me', auth, getMyProfile);

export default accountRouter;