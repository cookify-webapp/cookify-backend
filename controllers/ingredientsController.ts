import { Types } from 'mongoose';
import createError from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import createRestAPIError from '@error/createRestAPIError';
import { Ingredient } from '@models/ingredient';

export const getIngredientList = async (req: Request, res: Response, next: NextFunction) => {
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

export const getSameType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query?.typeId;
    if (typeof id !== 'string') throw createRestAPIError('INV_QUERY');

    const ingredients = await Ingredient.findSameType(id);
    if (_.size(ingredients)) return res.status(204).send();

    res.status(200).send({ ingredients });
  } catch (err) {
    return next(err);
  }
};

export const createIngredient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body?.data;
    if (!data) throw createRestAPIError('INV_REQ_BODY');

    if (data.unit) data.unit = new Types.ObjectId(data?.unit);
    if (data.type) data.type = new Types.ObjectId(data?.type);

    const ingredient = new Ingredient(data);

    await ingredient.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const editIngredient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query?.ingredientId;

    const ingredient = await Ingredient.findById(id).exec();
    if (!ingredient) throw createRestAPIError('DOC_NOT_FOUND');

    const data = req.body?.data;
    if (!data) throw createRestAPIError('INV_REQ_BODY');

    if (data.unit) data.unit = new Types.ObjectId(data?.unit);
    if (data.type) data.type = new Types.ObjectId(data?.type);

    await ingredient.replaceOne(data).exec();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

export const deleteIngredient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params?.ingredientId;

    const result = await Ingredient.findByIdAndDelete(id).exec();
    if (result) throw createError(404, 'No documents were deleted');

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
