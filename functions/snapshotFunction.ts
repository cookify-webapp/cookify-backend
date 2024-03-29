import { AggregatePaginateResult } from 'mongoose';

import { SnapshotInstanceInterface, SnapshotModelInterface } from '@models/snapshot';

export const listAll: (
  this: SnapshotModelInterface,
  page: number,
  perPage: number,
  username: string
) => Promise<AggregatePaginateResult<SnapshotInstanceInterface>> = async function (page, perPage, username) {
  const aggregate = this.aggregate<SnapshotInstanceInterface>()
    .match(username ? { 'author.username': username, isHidden: false } : { isHidden: false })
    .lookup({
      from: 'accounts',
      localField: 'author._id',
      foreignField: '_id',
      as: 'author_image',
      pipeline: [{ $project: { _id: 0, image: 1 } }],
    })
    .unwind({
      path: '$author_image',
      preserveNullAndEmptyArrays: true,
    })
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
