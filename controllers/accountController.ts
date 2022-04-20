import seedAccounts from "@mock/seedAccounts";
import { Types } from "mongoose";
import createError from "http-errors";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";

import { Account } from "@models/account";
import { errorText } from "@coreTypes/core";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.body?.data?.username;
    const password = req.body?.data?.password;
    if (!username || !password) throw createError(400, errorText.DATA);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw createError(500, errorText.SECRET);

    const account = await Account.findOne().byName(username).exec();
    if (!account) throw createError(403, errorText.USERNAME);

    const result = await account.comparePassword(password);
    if (!result) throw createError(403, errorText.PASSWORD);

    const token = account.signToken(secret);
    res.status(200).send({ token });
  } catch (err) {
    return next(err);
  }
};

export const getAllAccounts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accounts = await Account.find().select("-password").lean().exec();
    res.status(200).send({ accounts });
  } catch (err) {
    return next(err);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.username) throw createError(401, errorText.AUTH);

    const account = await Account.findOne()
      .byName(req.username)
      .select("username email accountType image bookmark")
      .lean()
      .exec();

    if (!account) throw createError(403, errorText.USERNAME);

    res.status(200).send({ account });
  } catch (err) {
    return next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body?.data;
    const saltRounds = 10;
    const hash = await bcrypt.hash(data?.password, saltRounds);
    const allergyIds = _.map(
      data?.allergy,
      (item: string) => new Types.ObjectId(item)
    );

    const account = new Account({
      username: data?.username,
      password: encodeURIComponent(hash),
      email: data?.email,
      accountType: "user",
      allergy: allergyIds,
    });

    await account.save();
    res.status(200).send({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

export const seedAccount = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await Account.startSession();
  try {
    session.startTransaction();
    await Account.deleteMany().session(session).exec();
    await Account.insertMany(seedAccounts, { session });
    session.commitTransaction();
    res.status(200).send({ message: "success" });
  } catch (err) {
    session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }
};
