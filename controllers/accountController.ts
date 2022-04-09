import createError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Account } from "./../models/account";
import { errorText } from "../types/core";

export const login = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.JWT_SECRET;

  Account.findByUsername(req.body?.username, (err, account) => {
    if (err) return next(createError(500, err.message));
    if (!account) return next(createError(403, errorText.USERNAME));
    if (!secret) return next(createError(500, errorText.SECRET));

    bcrypt.compare(
      req.body?.password,
      decodeURIComponent(account.password),
      (compareErr, result) => {
        if (compareErr) return next(compareErr);
        if (!result) return next(createError(403, errorText.PASSWORD));
        jwt.sign(
          { username: account.username },
          secret,
          {
            expiresIn: "24h",
          },
          (signErr, token) => {
            if (signErr) return next(signErr);
            res.status(200).send({ token });
          }
        );
      }
    );
  });
};

export const getAllAccounts = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  Account.find({}, (err, accounts) => {
    if (err) return next(err);
    res.status(200).send({ accounts });
  });
};

export const getMe = (req: Request, res: Response, _next: NextFunction) => {
  const acc = req.account;

  res.status(200).send({
    account: {
      username: acc?.username,
      email: acc?.email,
      accountType: acc?.accountType,
      image: acc?.imagePath,
    },
  });
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body?.data;
  const saltRounds = 10;

  bcrypt.hash(data.password, saltRounds, (hashErr, hash) => {
    if (hashErr) return next(hashErr);

    const account = new Account({
      username: data.username,
      password: encodeURIComponent(hash),
      email: data.email,
      accountType: "user",
      allergy: data.allergy,
    });

    account.validate((valErr) => {
      if (valErr) return next(valErr);

      account.save((saveErr) => {
        if (saveErr) return next(saveErr);
        res.status(200).send({ message: "success" });
      });
    });
  });
};
