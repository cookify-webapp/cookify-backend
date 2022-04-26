import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import _ from 'lodash';

import createRestAPIError from '@error/createRestAPIError';

const getPayload = (req: Request): JwtPayload => {
  let authHeader = req.headers['authorization'];
  if (!authHeader) throw createRestAPIError('AUTH');
  if (_.isArray(authHeader)) throw createRestAPIError('AUTH_HEADER');

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw createRestAPIError('MISSING_SECRET');

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

    if (!decoded.isAdmin) throw createRestAPIError('AUTH_ADMIN');

    req.username = decoded.username;
    return next();
  } catch (err) {
    return next(err);
  }
};
