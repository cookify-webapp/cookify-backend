import { Types } from "mongoose";
import { errorText } from "@coreTypes/core";
import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { Ingredient } from "@models/ingredient";

export const getIngredientList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;
    const type = req.query?.type as string;

    const ingredients = await Ingredient.listAll(
      page,
      perPage,
      searchWord,
      type
    );

    if (_.size(ingredients.docs) || ingredients.totalDocs)
      return res.status(204).send();

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

export const getSameType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query?.typeId as string;
    if (!id) throw createError(400, errorText.PARAM);

    const results = await Ingredient.findSameType(id);
    if (_.size(results)) return res.status(204).send();

    res.status(200).send({ ingredients: results });
  } catch (err) {
    return next(err);
  }
};

export const createIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body?.data;
    if (!data) throw createError(400, errorText.DATA);

    if (data.unit) data.unit = new Types.ObjectId(data?.unit);
    if (data.type) data.type = new Types.ObjectId(data?.type);

    const ingredient = new Ingredient(data);

    await ingredient.save();
    res.status(200).send({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

export const editIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query?.ingredientId;
    const ingredient = await Ingredient.findById(id).exec();
    if (!ingredient) throw createError(404, errorText.ID);

    const data = req.body?.data;
    if (!data) throw createError(400, errorText.DATA);

    if (data.unit) data.unit = new Types.ObjectId(data?.unit);
    if (data.type) data.type = new Types.ObjectId(data?.type);

    await ingredient.replaceOne(data).exec();
    res.status(200).send({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

export const deleteIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params?.ingredientId;

    const result = await Ingredient.deleteOne({ _id: id }).exec();
    if (result.deletedCount) throw createError(400, errorText.DELETE);

    res.status(200).send({ message: "Successful" });
  } catch (err) {
    return next(err);
  }
};
