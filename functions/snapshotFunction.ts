import { AggregatePaginateResult } from 'mongoose';

import { SnapshotInstanceInterface, SnapshotModelInterface } from '@models/snapshot';

export const listAll: (
  this: SnapshotModelInterface,
  page: number,
  perPage: number,
  username: string
) => Promise<AggregatePaginateResult<SnapshotInstanceInterface>> = async function (page, perPage, username) {
  const aggregate = this.aggregate<SnapshotInstanceInterface>()
    .match(username ? { 'author.username': username } : {})
    .lookup({
      from: 'accounts',
      localField: 'author._id',
      foreignField: '_id',
      as: 'author_image',
      pipeline: [{ $project: { _id: 0, image: 1 } }],
    })
    .lookup({
      from: 'recipes',
      localField: 'recipe',
      foreignField: '_id',
      as: 'recipe',
      pipeline: [{ $project: { name: 1 } }],
    })
    .unwind(
      {
        path: '$author_image',
        preserveNullAndEmptyArrays: true,
      },
      {
        path: '$recipe',
        preserveNullAndEmptyArrays: true,
      }
    )
    .addFields({
      'author.image': {
        $cond: [
          { $cond: [{ $isArray: '$author_image.image' }, { $size: '$author_image.image' }, '$author_image.image'] },
          '$author_image.image',
          '',
        ],
      },
    })
    .project({ author_image: 0 });

  return this.aggregatePaginate(aggregate, {
    page,
    limit: perPage,
    sort: '-createdAt',
  });
};
