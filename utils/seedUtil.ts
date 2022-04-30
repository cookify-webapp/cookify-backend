import { Model } from 'mongoose';
import { RequestHandler } from 'express';

import { Account } from '@models/account';
import seedAccounts from '@mock/seedAccounts';

import { CookingMethod, IngredientType } from '@models/type';
import seedCookingMethods from '@mock/seedCookingMethods';
import seedIngredientTypes from '@mock/seedIngredientTypes';

import { Unit } from '@models/unit';
import seedUnits from '@mock/seedUnits';

export const seedData: (model: Model<any>, data: any[], isNext: boolean) => RequestHandler =
  (model, data, isNext) => async (_req, res, next) => {
    try {
      await model.deleteMany().exec();
      await model.insertMany(data);
      return isNext ? next() : res.status(200).send({ message: 'success' });
    } catch (err) {
      return next(err);
    }
  };

export const seedAccount = (isNext: boolean = false) => seedData(Account, seedAccounts, isNext);

export const seedCookingMethod = (isNext: boolean = false) => seedData(CookingMethod, seedCookingMethods, isNext);

export const seedIngredientType = (isNext: boolean = false) => seedData(IngredientType, seedIngredientTypes, isNext);

export const seedUnit = (isNext: boolean = false) => seedData(Unit, seedUnits, isNext);
