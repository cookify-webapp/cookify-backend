import path from 'path';
import fs from 'fs';
import { Model } from 'mongoose';
import { RequestHandler } from 'express';

import { Account } from '@models/account';
import seedAccounts from '@mock/seedAccounts';

import { Ingredient } from '@models/ingredient';
import seedIngredients from '@mock/seedIngredients';

import { CookingMethod, IngredientType } from '@models/type';
import seedCookingMethods from '@mock/seedCookingMethods';
import seedIngredientTypes from '@mock/seedIngredientTypes';

import { Unit } from '@models/unit';
import seedUnits from '@mock/seedUnits';

import createRestAPIError from '@error/createRestAPIError';

const seedData: (model: Model<any>, data: any[], isNext: boolean) => RequestHandler =
  (model, data, isNext) => async (_req, res, next) => {
    try {
      await model.deleteMany().exec();
      await model.insertMany(data);
      return isNext ? next() : res.status(200).send({ message: 'success' });
    } catch (err) {
      return next(err);
    }
  };

export const seedImage: (imageType: string) => RequestHandler = (imageType) => async (_req, _res, next) => {
  try {
    const dir = process.env.IMAGE_DIR;
    if (!dir) throw createRestAPIError('MISSING_IMAGE_DIR');
    fs.rm(path.resolve(process.cwd(), 'public', 'images', imageType), { recursive: true, force: true }, (errRm) => {
      if (errRm) throw errRm;
      fs.cp(
        path.resolve(dir, imageType),
        path.resolve(process.cwd(), 'public', 'images', imageType),
        { errorOnExist: true, recursive: true },
        (errCp) => {
          if (errCp) throw errCp;
          return next();
        }
      );
    });
  } catch (err) {
    return next(err);
  }
};

export const seedAccount = (isNext: boolean = false) => seedData(Account, seedAccounts, isNext);

export const seedCookingMethod = (isNext: boolean = false) => seedData(CookingMethod, seedCookingMethods, isNext);

export const seedIngredient = (isNext: boolean = false) => seedData(Ingredient, seedIngredients, isNext);

export const seedIngredientType = (isNext: boolean = false) => seedData(IngredientType, seedIngredientTypes, isNext);

export const seedUnit = (isNext: boolean = false) => seedData(Unit, seedUnits, isNext);
