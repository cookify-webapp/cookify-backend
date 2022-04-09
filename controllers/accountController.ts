import createError from "http-errors";
import jwt from "jsonwebtoken";
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
    const secret = process.env.JWT_SECRET;
    if (!secret) throw createError(500, errorText.SECRET);
    const account = await Account.findByUsername(req.body?.username).exec();
    if (!account) throw createError(403, errorText.USERNAME);
    const result = await bcrypt.compare(
      req.body?.password,
      decodeURIComponent(account.password)
    );
    if (!result) throw createError(403, errorText.PASSWORD);
    const token = jwt.sign({ username: account.username }, secret, {
      expiresIn: "24h",
    });
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
    const accounts = await Account.find({}).exec();
    res.status(200).send({ accounts });
  } catch (err) {
    return next(err);
  }
};

export const getMe = (req: Request, res: Response, _next: NextFunction) => {
  const acc = req.account;

  res.status(200).send({
    account: {
      username: acc?.username,
      email: acc?.email,
      accountType: acc?.accountType,
      image: acc?.imagePath,
    },
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body?.data;
    const saltRounds = 10;

    const hash = await bcrypt.hash(data.password, saltRounds);

    const account = new Account({
      username: data.username,
      password: encodeURIComponent(hash),
      email: data.email,
      accountType: "user",
      allergy: data.allergy,
    });

    await account.save();
    res.status(200).send({ message: "success" });
  } catch (err) {
    return next(err);
  }
};
