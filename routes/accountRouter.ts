import express from "express";
import { getAllAccounts } from '../controllers/accountController';

const accountRouter = express.Router();

accountRouter.get('/', getAllAccounts);

export default accountRouter;