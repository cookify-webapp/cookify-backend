import path from 'path';
import fs from 'fs';
import { Model } from 'mongoose';
import { RequestHandler } from 'express';
import { deleteObject, listAll, ref } from 'firebase/storage';

import { Account } from '@models/account';
import seedAccounts from '@mock/seedAccounts';

import { Ingredient } from '@models/ingredient';
import seedIngredients from '@mock/seedIngredients';

import { CookingMethod, IngredientType } from '@models/type';
import seedCookingMethods from '@mock/seedCookingMethods';
import seedIngredientTypes from '@mock/seedIngredientTypes';

import { Unit } from '@models/unit';
import seedUnits from '@mock/seedUnits';

import { Recipe } from '@models/recipe';
import seedRecipes from '@mock/seedRecipes';

import { uploadImage } from './imageUtil';
import { firebaseStorage } from '@services/firebaseManager';
import createRestAPIError from '@error/createRestAPIError';

const seedData: (model: Model<any>, data: any[]) => RequestHandler = (model, data) => async (_req, _res, next) => {
  try {
    await model.deleteMany().exec();
    await model.insertMany(data);
    return next();
  } catch (err) {
    return next(err);
  }
};

const seedImage: (model: Model<any>, imageType: string) => RequestHandler =
  (model, imageType) => async (_req, _res, next) => {
    try {
      const storageRef = ref(firebaseStorage, `images/${process.env.NODE_ENV}/${imageType}`);
      const { items } = await listAll(storageRef);
      for (const imagesRef of items) {
        await deleteObject(imagesRef);
      }

      const dir = process.env.IMAGE_DIR;
      if (!dir) throw createRestAPIError('MISSING_IMAGE_DIR');

      fs.readdir(path.resolve(dir, imageType), (err, files) => {
        if (err) throw err;
        for (const fileName of files) {
          fs.readFile(path.resolve(dir, imageType, fileName), async (err, file) => {
            if (err) throw err;
            const image = await uploadImage(imageType, fileName, file);
            await model.findOneAndUpdate({ imageName: fileName }, { image }).exec();
          });
        }
        return next();
      });
    } catch (err) {
      return next(err);
    }
  };

export const seedAccount = seedData(Account, seedAccounts);

export const seedCookingMethod = seedData(CookingMethod, seedCookingMethods);

export const seedIngredient = seedData(Ingredient, seedIngredients);

export const seedIngredientType = seedData(IngredientType, seedIngredientTypes);

export const seedUnit = seedData(Unit, seedUnits);

export const seedRecipe = seedData(Recipe, seedRecipes);

export const seedAccountImages = seedImage(Account, 'accounts');

export const seedIngredientImages = seedImage(Ingredient, 'ingredients');

export const seedRecipeImages = seedImage(Recipe, 'recipes');
