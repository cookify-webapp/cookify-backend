import { UnitInstanceInterface } from './../models/unit';
import { Types } from 'mongoose';
import { RequestHandler } from 'express';
import _, { isNull } from 'lodash';

import { Ingredient } from '@models/ingredient';
import { IngredientType } from '@models/type';
import { Recipe } from '@models/recipe';
import { Unit } from '@models/unit';
import { deleteImage } from '@utils/imageUtil';

import createRestAPIError from '@error/createRestAPIError';
import NutritionDetailService from '@services/nutritionDetailService';

export const getIngredientList: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;
    const type = req.query?.type as string;

    const ingredients = await Ingredient.listAll(page, perPage, searchWord, type);
    if (!_.size(ingredients.docs) || !ingredients.totalDocs) return res.status(204).send();

    res.status(200).send({
      ingredients: ingredients.docs,
      page: ingredients.page,
      perPage: ingredients.limit,
      totalCount: ingredients.totalDocs,
      totalPages: ingredients.totalPages,
    });
  } catch (err) {
    return next(err);
  }
};

export const getIngredientTypes: RequestHandler = async (_req, res, next) => {
  try {
    const ingredientTypes = await IngredientType.find().exec();
    if (!ingredientTypes) return res.status(204).send();

    res.status(200).send({ ingredientTypes });
  } catch (err) {
    return next(err);
  }
};

export const getUnits: RequestHandler = async (_req, res, next) => {
  try {
    const units = await Unit.find().exec();
    if (!units) return res.status(204).send();

    res.status(200).send({ units });
  } catch (err) {
    return next(err);
  }
};

export const sampleByType: RequestHandler = async (req, res, next) => {
  try {
    const id = req.query?.typeId;
    if (typeof id !== 'string' || !id) throw createRestAPIError('INV_QUERY');

    const ingredients = await Ingredient.sampleByType(id);
    if (!_.size(ingredients)) return res.status(204).send();

    res.status(200).send({ ingredients });
  } catch (err) {
    return next(err);
  }
};

export const getIngredientDetail: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.ingredientId;

    const ingredient = await Ingredient.findById(id).exec();
    if (!ingredient) throw createRestAPIError('DOC_NOT_FOUND');

    res.status(200).send({ ingredient });
  } catch (err) {
    return next(err);
  }
};

export const createIngredient: RequestHandler = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body?.data);
    if (!data) throw createRestAPIError('INV_REQ_BODY');

    data.image = req.file?.filename;

    const ingredient = new Ingredient(data);

    const popIngredient = await ingredient.populate<{ unit: UnitInstanceInterface }>('unit');
    ingredient.nutritionalDetail = await NutritionDetailService.getByIngredient(
      popIngredient.unit.queryKey,
      ingredient.queryKey
    );

    await ingredient.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    req.file && deleteImage('ingredients', req.file?.filename);
    return next(err);
  }
};

export const editIngredient: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.ingredientId;

    const data = JSON.parse(req.body?.data);
    if (!data) throw createRestAPIError('INV_REQ_BODY');

    const ingredient = await Ingredient.findById(id).exec();
    console.log(ingredient);
    if (!ingredient) throw createRestAPIError('DOC_NOT_FOUND');

    const oldImage = data?.image;

    ingredient.name = data?.name || ingredient.name;
    ingredient.queryKey = data?.queryKey || ingredient.queryKey;
    if (ingredient.unit.id === data?.unit) {
      ingredient.depopulate('unit');
    } else {
      ingredient.unit = data?.unit;
    }
    ingredient.type = data?.type || ingredient.type;
    ingredient.image = req.file?.filename || data?.image || ingredient.image;
    ingredient.shopUrl = data?.shopUrl || ingredient.shopUrl;

    if (ingredient.isModified('queryKey') || ingredient.isModified('unit')) {
      ingredient.nutritionalDetail = await NutritionDetailService.getByIngredient(
        ingredient.unit.queryKey,
        ingredient.queryKey
      );
    }

    await ingredient.save({ validateModifiedOnly: true });

    req.file && ingredient.image !== oldImage && deleteImage('ingredients', oldImage);

    res.status(200).send({ message: 'success' });
  } catch (err) {
    req.file && deleteImage('ingredients', req.file?.filename);
    return next(err);
  }
};

export const deleteIngredient: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.ingredientId;

    const ref = await Recipe.exists({ ingredients: new Types.ObjectId(id) }).exec();
    if (ref) throw createRestAPIError('DEL_REFERENCE');

    const result = await Ingredient.findByIdAndDelete(id).exec();
    if (!result) throw createRestAPIError('DOC_NOT_FOUND');

    deleteImage('ingredients', result.image);

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
