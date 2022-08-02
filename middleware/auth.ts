import { Request, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import createRestAPIError from '@error/createRestAPIError';

const getPayload = (req: Request, byPass: boolean): JwtPayload => {
  let authHeader = req.headers.authorization;
  if (!authHeader)
    if (byPass) {
      return {};
    } else {
      throw createRestAPIError('AUTH');
    }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw createRestAPIError('MISSING_SECRET');

  return jwt.verify(token, secret) as JwtPayload;
};

export const auth: RequestHandler = async (req, res, next) => {
  try {
    const decoded = getPayload(req, false);
    console.log('h')

    res.locals.username = decoded.username;
    return next();
  } catch (err) {
    return next(err);
  }
};

export const adminAuth: RequestHandler = async (req, res, next) => {
  try {
    const decoded = getPayload(req, false);
    if (!decoded.isAdmin) throw createRestAPIError('AUTH_ADMIN');

    res.locals.username = decoded.username;
    return next();
  } catch (err) {
    return next(err);
  }
};

export const byPassAuth: RequestHandler = async (req, res, next) => {
  try {
    const decoded = getPayload(req, true);

    res.locals.username = decoded.username;
    return next();
  } catch (err) {
    return next(err);
  }
};
