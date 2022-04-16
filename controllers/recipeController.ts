import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { Recipe } from "../models/recipe";

export const getRecipeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query?.page as string);
    const perPage = parseInt(req.query?.perPage as string);
    const searchWord = req.query?.searchWord as string;
    const ingredients = req.query?.ingredients as string[];
    const method = req.query?.method as string;

    const recipes = await Recipe.listRecipe(
      page,
      perPage,
      searchWord,
      ingredients,
      method
    );

    if (_.size(recipes.docs) > 0 || recipes.totalDocs > 0) {
      res.status(200).send({
        recipes: recipes.docs,
        page: recipes.page,
        perPage: recipes.limit,
        totalCount: recipes.totalDocs,
        totalPages: recipes.totalPages,
      });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    return next(err);
  }
};
