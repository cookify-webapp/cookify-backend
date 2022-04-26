import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import { Account } from '@models/account';
import { Recipe } from '@models/recipe';

import createRestAPIError from '@error/createRestAPIError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.body?.data?.username;
    const password = req.body?.data?.password;
    if (!username || !password) throw createRestAPIError('INV_REQ_BODY');

    const secret = process.env.JWT_SECRET;
    if (!secret) throw createRestAPIError('MISSING_SECRET');

    const account = await Account.findOne().byName(username).select('password').exec();
    if (!account) throw createRestAPIError('WRONG_USERNAME');

    const result = await account.comparePassword(password);
    if (!result) throw createRestAPIError('WRONG_PASSWORD');

    const token = account.signToken(secret);
    res.status(200).send({ token });
  } catch (err) {
    return next(err);
  }
};

export const getAllAccounts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await Account.find().lean().exec();
    res.status(200).send({ accounts });
  } catch (err) {
    return next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.username) throw createRestAPIError('AUTH');

    const account = await Account.findOne()
      .byName(req.username)
      .select('username email accountType image bookmark')
      .lean()
      .exec();

    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    res.status(200).send({ account });
  } catch (err) {
    return next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body?.data;
    const saltRounds = 10;
    const hash = await bcrypt.hash(data?.password, saltRounds);
    const allergyIds = _.map(data?.allergy, (item: string) => new Types.ObjectId(item));

    const account = new Account({
      username: data?.username,
      password: encodeURIComponent(hash),
      email: data?.email,
      allergy: allergyIds,
    });

    await account.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const setBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.username) throw createRestAPIError('AUTH');

    const account = await Account.findOne().byName(req.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const id = req.params?.recipeId;

    const recipe = await Recipe.findById(id).exec();
    if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

    await account
      .updateOne({
        [_.includes(account.bookmark, recipe._id) ? '$pull' : '$addToSet']: {
          bookmark: recipe._id,
        },
      })
      .exec();

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.username) throw createRestAPIError('AUTH');

    const data = req.body?.data;

    const account = await Account.findOne().byName(req.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    account.username = data?.username;
    account.email = data?.email;

    await account.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
