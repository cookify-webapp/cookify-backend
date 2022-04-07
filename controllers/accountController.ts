import { NextFunction, Request, Response } from "express";
import { Account } from "./../models/account";

export const getAllAccounts = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  Account.find({}, (err, accounts) => {
    if (err) {
      next(err);
    } else {
      res.status(200).send({ accounts });
    }
  });
};
