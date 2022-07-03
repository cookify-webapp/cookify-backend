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

const seedData: (model: Model<any>, data: any[], hasNext: boolean) => RequestHandler =
  (model, data, hasNext) => async (_req, res, next) => {
    try {
      await model.deleteMany().exec();
      await model.insertMany(data);
      return hasNext ? next() : res.status(200).send({ message: 'success' });
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

export const seedAccount = (hasNext: boolean = false) => seedData(Account, seedAccounts, hasNext);

export const seedCookingMethod = (hasNext: boolean = false) => seedData(CookingMethod, seedCookingMethods, hasNext);

export const seedIngredient = (hasNext: boolean = false) => seedData(Ingredient, seedIngredients, hasNext);

export const seedIngredientType = (hasNext: boolean = false) => seedData(IngredientType, seedIngredientTypes, hasNext);

export const seedUnit = (hasNext: boolean = false) => seedData(Unit, seedUnits, hasNext);
