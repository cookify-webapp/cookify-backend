import { PaginateResult, FilterQuery } from 'mongoose';

import { IngredientInstanceInterface, IngredientModelInterface } from '@models/ingredient';

export const listAll: (
  this: IngredientModelInterface,
  page: number,
  perPage: number,
  searchWord: string,
  type: string
) => Promise<PaginateResult<IngredientInstanceInterface>> = async function (page, perPage, searchWord, type) {
  const filter: FilterQuery<IngredientInstanceInterface> = {
    name: { $regex: searchWord, $options: 'i' },
  };
  if (type) filter['type._id'] = type;

  return this.paginate(filter, {
    page: page,
    limit: perPage,
    select: 'name type image',
  });
};

export const findSameType: (this: IngredientModelInterface, type: string) => Promise<IngredientInstanceInterface[]> =
  async function (type) {
    return this.aggregate<IngredientInstanceInterface>()
      .lookup({
        from: 'ingredientTypes',
        localField: 'type',
        foreignField: '_id',
        as: 'type',
      })
      .match({ 'type._id': type })
      .project({ name: 1, type: 1, image: 1 })
      .sample(4)
      .exec();
  };
