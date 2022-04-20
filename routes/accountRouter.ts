import express from "express";

import { getMe, getAllAccounts, seedAccount } from "@controllers/accountController";
import { auth, adminAuth } from "@middleware/auth";

const accountRouter = express.Router();

accountRouter.get("/", adminAuth, getAllAccounts);

accountRouter.get("/me", auth, getMe);

accountRouter.get("/seed", seedAccount);

export default accountRouter;
