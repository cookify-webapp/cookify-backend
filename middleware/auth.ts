import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { CallbackError } from "mongoose";

import jwt, { JwtPayload } from "jsonwebtoken";
import { Account, AccountInstanceInterface } from "../models/account";

export const auth = async function (
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["Authorization"] as string;
  const token = authHeader?.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  Account.findByUsername(
    decoded.username,
    (err: CallbackError, account: AccountInstanceInterface) => {
      if (err) {
        next(err);
      } else if (!account) {
        next(createError(401, "Please authenticate"));
      } else {
        req.account = account;
        next();
      }
    }
  );
};
