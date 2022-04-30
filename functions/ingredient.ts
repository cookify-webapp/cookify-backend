import { PaginateResult, FilterQuery, Types } from 'mongoose';

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

export const sampleByType: (this: IngredientModelInterface, type: string) => Promise<IngredientInstanceInterface[]> =
  async function (type) {
    return this.aggregate<IngredientInstanceInterface>()
      .lookup({
        from: 'ingredienttypes',
        localField: 'type',
        foreignField: '_id',
        as: 'type',
      })
      .unwind('type')
      .match({ 'type._id': new Types.ObjectId(type) })
      .project({ name: 1, type: 1, image: 1 })
      .sample(4)
      .exec();
  };
