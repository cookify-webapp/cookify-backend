import { RequestHandler } from 'express';
import _ from 'lodash';

import { Ingredient } from '@models/ingredient';
import { IngredientType } from '@models/type';
import { Recipe } from '@models/recipe';
import { Unit, UnitInstanceInterface } from '@models/unit';
import { deleteImage } from '@utils/imageUtil';

import createRestAPIError from '@error/createRestAPIError';
import NutritionDetailService from '@services/nutritionDetailService';

//---------------------
//   FETCH MANY
//---------------------
export const getIngredientList: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;
    const typeId = req.query?.typeId as string;

    const ingredients = await Ingredient.listAll(page, perPage, searchWord, typeId);
    if (!ingredients.totalDocs) return res.status(204).send();

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
    const id = req.params?.ingredientId;

    const ingredients = await Ingredient.sampleByType(id);
    if (!_.size(ingredients)) return res.status(204).send();

    res.status(200).send({ ingredients });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   FETCH ONE
//---------------------
export const getIngredientDetail: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.ingredientId;

    const ingredient = await Ingredient.findById(id).select('-createdAt').exec();
    if (!ingredient) throw createRestAPIError('DOC_NOT_FOUND');

    res.status(200).send({ ingredient });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   CREATE
//---------------------
export const createIngredient: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body?.data;
    data.image = req.file?.filename;

    const ingredient = new Ingredient(data);

    await ingredient.populate<{ unit: UnitInstanceInterface }>('unit');
    ingredient.nutritionalDetail = await NutritionDetailService.getByIngredient(
      ingredient.unit.queryKey,
      ingredient.queryKey
    );

    await ingredient.save();
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   EDIT
//---------------------
export const editIngredient: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.ingredientId;
    const data = req.body?.data;

    const ingredient = await Ingredient.findById(id).setOptions({ autopopulate: false }).exec();
    if (!ingredient) throw createRestAPIError('DOC_NOT_FOUND');

    const oldImage = ingredient.image;

    ingredient.set({
      name: data?.name,
      queryKey: data?.queryKey,
      type: data?.type,
      image: req.file?.filename || ingredient.image,
      shopUrl: data?.shopUrl,
    });
    if (data?.unit && ingredient.unit.toString() !== data?.unit) ingredient.set('unit', data?.unit);

    if (ingredient.isModified(['queryKey', 'unit'])) {
      await ingredient.populate<{ unit: UnitInstanceInterface }>('unit');
      ingredient.nutritionalDetail = await NutritionDetailService.getByIngredient(
        ingredient.unit.queryKey,
        ingredient.queryKey
      );
    }

    await ingredient.save({ validateModifiedOnly: true });
    oldImage && ingredient.image !== oldImage && deleteImage('ingredients', oldImage);
    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};

//---------------------
//   DELETE
//---------------------
export const deleteIngredient: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params?.ingredientId;

    const ref = await Recipe.exists({ 'ingredients.ingredient': id }).exec();
    if (ref) throw createRestAPIError('DEL_REFERENCE');

    const result = await Ingredient.findByIdAndDelete(id).exec();
    if (!result) throw createRestAPIError('DOC_NOT_FOUND');

    result.image && deleteImage('ingredients', result.image);

    res.status(200).send({ message: 'success' });
  } catch (err) {
    return next(err);
  }
};
