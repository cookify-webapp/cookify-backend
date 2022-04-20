import express from "express";

import { login, register } from "@controllers/accountController";

const indexRouter = express.Router();

indexRouter.get("/login", login);

indexRouter.post("/register", register);

export default indexRouter;
