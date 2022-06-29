import { PaginateResult, FilterQuery, Types } from 'mongoose';

import { IngredientInstanceInterface, IngredientModelInterface } from '@models/ingredient';

import createRestAPIError from '@error/createRestAPIError';

export const listAll: (
  this: IngredientModelInterface,
  page: number,
  perPage: number,
  searchWord: string,
  typeId: string
) => Promise<PaginateResult<IngredientInstanceInterface>> = async function (page, perPage, searchWord, typeId) {
  const filter: FilterQuery<IngredientInstanceInterface> = { name: { $regex: searchWord, $options: 'i' } };
  if (typeId) filter.type = typeId;

  return this.paginate(filter, { page: page, limit: perPage, select: 'name type image unit', sort: '-createdAt name' });
};

export const sampleByType: (
  this: IngredientModelInterface,
  ingredientId: string
) => Promise<IngredientInstanceInterface[]> = async function (ingredientId) {
  const self = await this.findById(ingredientId, { type: 1 }, { autopopulate: false }).exec();
  if (!self) throw createRestAPIError('DOC_NOT_FOUND');

  return this.aggregate<IngredientInstanceInterface>()
    .match({ _id: { $ne: new Types.ObjectId(ingredientId) }, type: self.type })
    .project({ name: 1, type: 1, image: 1 })
    .sample(4)
    .lookup({
      from: 'ingredienttypes',
      localField: 'type',
      foreignField: '_id',
      as: 'type',
    })
    .unwind('type')
    .exec();
};
