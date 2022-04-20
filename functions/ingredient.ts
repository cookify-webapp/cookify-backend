import { PaginateResult, FilterQuery } from "mongoose";

import {
  Ingredient,
  IngredientInstanceInterface,
  ingredientSchema,
} from "@models/ingredient";

//---------------------
//   STATICS
//---------------------
ingredientSchema.statics.listAll = async function (
  page: number,
  perPage: number,
  searchWord: string,
  type: string
): Promise<PaginateResult<IngredientInstanceInterface>> {
  const filter: FilterQuery<IngredientInstanceInterface> = {
    name: { $regex: searchWord, $options: "i" },
  };
  if (type) filter["type._id"] = type;

  return Ingredient.paginate(filter, {
    page: page,
    limit: perPage,
    select: "name type image",
  });
};

ingredientSchema.statics.findSameType = async function (
  type: string
): Promise<IngredientInstanceInterface[]> {
  return Ingredient.aggregate<IngredientInstanceInterface>()
    .lookup({
      from: "ingredientTypes",
      localField: "type",
      foreignField: "_id",
      as: "type",
    })
    .match({ "type._id": type })
    .project({ name: 1, type: 1, image: 1 })
    .sample(4)
    .exec();
};
