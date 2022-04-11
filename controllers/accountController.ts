import createError from "http-errors";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Account } from "./../models/account";
import { errorText } from "../types/core";

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

    const account = await Account.find().byName(username).exec();
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
    const accounts = await Account.find().select("-password").exec();
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

    const account = await Account.find()
      .byName(req.username)
      .select("username email accountType image")
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
    const account = new Account({
      username: data?.username,
      password: encodeURIComponent(hash),
      email: data?.email,
      accountType: "user",
      allergy: data?.allergy,
    });

    await account.save();
    res.status(200).send({ message: "success" });
  } catch (err) {
    return next(err);
  }
};
