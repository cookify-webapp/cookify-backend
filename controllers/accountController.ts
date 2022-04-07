import createError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Account, AccountInterface } from "./../models/account";
import { CallbackError } from "mongoose";

export const login = (req: Request, res: Response, next: NextFunction) => {
  Account.findByUsernameAndPassword(
    req.body?.username,
    req.body?.password,
    (err: CallbackError, account: AccountInterface) => {
      if (err) {
        next(createError(500, err.message));
      } else if (!account) {
        next(createError(401, "Invalid username or password"));
      } else {
        const token = jwt.sign(
          { username: account.username },
          process.env.JWT_SECRET as string
        );
        res.status(200).send({
          token: token,
        });
      }
    }
  );
};

export const getAllAccounts = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  Account.find(
    {},
    (err: CallbackError, accounts: AccountInterface[]) => {
      if (err) {
        next(err);
      } else {
        res.status(200).send({ accounts });
      }
    }
  );
};

export const getAccount = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["Authorization"] as string;
  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  Account.findByUsername(
    decoded.username,
    (err: CallbackError, account: AccountInterface) => {
      if (err) {
        throw err;
      } else if (!account) {
        next(createError(401, "Please authenticate"));
      } else {
        res.status(200).send({ account });
      }
    },
    { username: 1, email: 1, accountType: 1, imagePath: "image" }
  );
};
