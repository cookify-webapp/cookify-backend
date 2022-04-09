import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { Account } from "../models/account";
import { errorText } from "../types/core";

export const auth = async function (
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["Authorization"] as string;
  const token = authHeader?.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) return next(createError(500, errorText.SECRET));
  
  jwt.verify(token, secret, (verifyErr, decoded) => {
    if (verifyErr) return next(verifyErr);
    if (!decoded) return next(createError(500, errorText.TOKEN));

    const castDecoded = decoded as JwtPayload;
    
    Account.findByUsername(castDecoded.username, (err, account) => {
      if (err) return next(err);
      if (!account) return next(createError(401, errorText.AUTH));
      req.account = account;
      next();
    });
  });
};
