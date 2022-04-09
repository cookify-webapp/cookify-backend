import createError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Account } from "./../models/account";

export const login = (req: Request, res: Response, next: NextFunction) => {
  Account.findByUsername(req.body?.username, (err, account) => {
    if (err) {
      next(createError(500, err.message));
    } else if (!account) {
      next(createError(403, "Incorrect username"));
    } else if (!process.env.JWT_SECRET) {
      next(createError(500, "Missing or invalid token secret in environment"));
    } else {
      bcrypt.compare(
        req.body?.password,
        account.password,
        function (compareErr, result) {
          if (compareErr) {
            next(compareErr);
          } else {
            if (result) {
              const token = jwt.sign(
                { username: account.username },
                process.env.JWT_SECRET as string
              );
              res.status(200).send({ token });
            } else {
              next(createError(403, "Incorrect password"));
            }
          }
        }
      );
    }
  });
};

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
  const saltRounds = 10;
  bcrypt.hash(data.password, saltRounds, (hashErr, hash) => {
    if (hashErr) {
      next(hashErr);
    } else {
      const account = new Account({
        username: data.username,
        password: hash,
        email: data.email,
        accountType: "user",
        allergy: data.allergy,
      });
      account.validate((valErr) => {
        if (valErr) {
          next(valErr);
        } else {
          account.save((saveErr) => {
            if (saveErr) {
              next(saveErr);
            } else {
              res.status(200).send({ message: "success" });
            }
          });
        }
      });
    }
  });
};
