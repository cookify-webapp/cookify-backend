import { PaginateResult, FilterQuery, Types } from 'mongoose';

import { IngredientInstanceInterface, IngredientModelInterface } from '@models/ingredient';

export const listAll: (
  this: IngredientModelInterface,
  page: number,
  perPage: number,
  searchWord: string,
  typeId: string
) => Promise<PaginateResult<IngredientInstanceInterface>> = async function (page, perPage, searchWord, typeId) {
  const filter: FilterQuery<IngredientInstanceInterface> = { name: { $regex: searchWord, $options: 'i' } };
  if (typeId) filter.type = typeId;

  return this.paginate(filter, { page: page, limit: perPage, select: 'name type image' });
};

export const sampleByType: (this: IngredientModelInterface, typeId: string) => Promise<IngredientInstanceInterface[]> =
  async function (typeId) {
    return this.aggregate<IngredientInstanceInterface>()
      .match({ type: new Types.ObjectId(typeId) })
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
