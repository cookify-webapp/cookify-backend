import createError from "http-errors";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Account, AccountInstanceInterface } from "./../models/account";
import { CallbackError } from "mongoose";

export const login = (req: Request, res: Response, next: NextFunction) => {
  Account.findByUsernameAndPassword(
    req.body?.username,
    req.body?.password,
    (err: CallbackError, account: AccountInstanceInterface) => {
      if (err) {
        next(createError(500, err.message));
      } else if (!account) {
        next(createError(403, "Invalid username or password"));
      } else if (!process.env.JWT_SECRET) {
        next(createError(500, "Missing or invalid token secret in environment"));
      } else {
        const token = jwt.sign(
          { username: account.username },
          process.env.JWT_SECRET
        );
        res.status(200).send({ token });
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
    (err: CallbackError, accounts: AccountInstanceInterface[]) => {
      if (err) {
        next(err);
      } else {
        res.status(200).send({ accounts });
      }
    }
  );
};

export const getMyProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const acc = req.account;
  if (acc) {
    res.status(200).send({
      account: {
        username: acc?.username,
        email: acc?.email,
        accountType: acc?.accountType,
        image: acc?.imagePath,
      },
    });
  } else {
    next(createError(401, "Please authenticate"));
  }
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body?.data;
  const account = new Account({
    username: data.username,
    password: data.password,
    email: data.email,
    accountType: "user",
    allergy: data.allergy,
  });
  account.validate((err: CallbackError) => {
    if (err) {
      next(err);
    } else {
      account.save((saveErr: CallbackError) => {
        if (saveErr) {
          next(saveErr);
        } else {
          res.status(200).send({ message: "success" });
        }
      });
    }
  });
};
