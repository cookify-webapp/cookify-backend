import createError from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import _ from 'lodash';

import { errorText } from '@coreTypes/core';

const getPayload = (req: Request): JwtPayload => {
  let authHeader = req.headers['Authorization'];
  if (!authHeader) throw createError(401, errorText.AUTH);
  if (_.isArray(authHeader)) throw createError(400, errorText.AUTH_HEADER);

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw createError(500, errorText.SECRET);

  return jwt.verify(token, secret) as JwtPayload;
};

export const auth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const decoded = getPayload(req);

    req.username = decoded.username;
    return next();
  } catch (err) {
    return next(err);
  }
};

export const adminAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const decoded = getPayload(req);

    if (!decoded.isAdmin) throw createError(401, errorText.ADMIN);

    req.username = decoded.username;
    return next();
  } catch (err) {
    return next(err);
  }
};
