import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { errorText } from "../types/core";
import _ from "lodash";

export const auth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let authHeader = req.headers["Authorization"];
    if (!authHeader) throw createError(401, errorText.AUTH);
    if (_.isArray(authHeader)) throw createError(400, errorText.AUTH_HEADER);

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw createError(500, errorText.SECRET);

    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    req.username = decoded.username;
    return next();
  } catch (err) {
    return next(err);
  }
};
