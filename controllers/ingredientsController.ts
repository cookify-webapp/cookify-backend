import { RequestHandler } from 'express';
import _ from 'lodash';

import { Ingredient } from '@models/ingredient';
import { IngredientType } from '@models/type';
import { Recipe } from '@models/recipe';
import { Unit } from '@models/unit';

import createRestAPIError from '@error/createRestAPIError';

export const getIngredientList: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;
    const type = req.query?.type as string;

    const ingredients = await Ingredient.listAll(page, perPage, searchWord, type);
    if (_.size(ingredients.docs) || ingredients.totalDocs) return res.status(204).send();

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
    if (_.size(ingredients)) return res.status(204).send();

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
    const data = req.body?.data;
    if (!data) throw createRestAPIError('INV_REQ_BODY');

    data.image = req.file?.path;

    const ingredient = new Ingredient(data);

    await ingredient.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const editIngredient: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.ingredientId;

    const data = req.body?.data;
    if (!data) throw createRestAPIError('INV_REQ_BODY');

    data.image = req.file?.path || data.image;

    const ingredient = await Ingredient.findOneAndReplace({ _id: id }, data, {
      runValidators: true,
      context: 'query',
    }).exec();
    if (!ingredient) throw createRestAPIError('DOC_NOT_FOUND');

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const deleteIngredient: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.ingredientId;

    const ref = await Recipe.exists({ ingredients: id }).exec();
    if (ref) throw createRestAPIError('DEL_REFERENCE');

    const result = await Ingredient.findByIdAndDelete(id).exec();
    if (!result) throw createRestAPIError('DOC_NOT_FOUND');

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
