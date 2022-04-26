import { Model } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

import { Account } from '@models/account';
import seedAccounts from '@mock/seedAccounts';

import { IngredientType } from '@models/type';
import seedIngredientTypes from '@mock/seedIngredientTypes';

export const seedData =
  (model: Model<any>, data: any[], isNext: boolean) => async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await model.deleteMany().exec();
      await model.insertMany(data);
      return isNext ? next() : res.status(200).send({ message: 'success' });
    } catch (err) {
      return next(err);
    }
  };

export const seedAccount = (isNext: boolean = false) => seedData(Account, seedAccounts, isNext);

export const seedIngredientType = (isNext: boolean = false) => seedData(IngredientType, seedIngredientTypes, isNext);
