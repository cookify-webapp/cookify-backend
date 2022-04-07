import { NextFunction, Request, Response } from "express";
import { CallbackError } from "mongoose";

import jwt, { JwtPayload } from "jsonwebtoken";
import { Account, AccountInterface } from "../models/account";

const auth = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["Authorization"] as string;
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    Account.findByUsername(decoded.username, (err: CallbackError, _account: AccountInterface) => {
      if (err) {
        throw err;
      } else {
        next();
      }
    });
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
