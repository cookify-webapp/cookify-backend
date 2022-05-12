import { RequestHandler } from 'express';
import _, { pull } from 'lodash';

import { Account } from '@models/account';
import { Recipe } from '@models/recipe';

import createRestAPIError from '@error/createRestAPIError';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const username = req.body?.data?.username;
    const password = req.body?.data?.password;
    if (!username || !password) throw createRestAPIError('INV_REQ_BODY');

    const secret = process.env.JWT_SECRET;
    if (!secret) throw createRestAPIError('MISSING_SECRET');

    const account = await Account.findOne().byName(username).select('username password accountType').exec();
    if (!account) throw createRestAPIError('WRONG_USERNAME');

    const result = await account.comparePassword(password);
    if (!result) throw createRestAPIError('WRONG_PASSWORD');

    const token = account.signToken(secret);
    res.status(200).send({ token });
  } catch (err) {
    return next(err);
  }
};

export const getAllAccounts: RequestHandler = async (_req, res, next) => {
  try {
    const accounts = await Account.find().lean().exec();
    res.status(200).send({ accounts });
  } catch (err) {
    return next(err);
  }
};

export const getMe: RequestHandler = async (req, res, next) => {
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

export const register: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body?.data;
    if (!data) throw createRestAPIError('INV_REQ_BODY');

    const account = new Account(data);
    await account.hashPassword();

    await account.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const setBookmark: RequestHandler = async (req, res, next) => {
  try {
    if (!req.username) throw createRestAPIError('AUTH');

    const account = await Account.findOne().byName(req.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    const id = req.params?.recipeId;

    const recipe = await Recipe.findById(id).exec();
    if (!recipe) throw createRestAPIError('DOC_NOT_FOUND');

    account.bookmark[_.includes(account.bookmark, recipe._id) ? 'pull' : 'push'](recipe._id);

    await account.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const editProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.username) throw createRestAPIError('AUTH');

    const data = req.body?.data;

    const account = await Account.findOne().byName(req.username).exec();
    if (!account) throw createRestAPIError('ACCOUNT_NOT_FOUND');

    account.username = data?.username || account.username;
    account.email = data?.email || account.email;

    await account.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
