import express from "express";
import { login } from "../controllers/accountController";

const indexRouter = express.Router();

indexRouter.get('/login', login);

export default indexRouter;