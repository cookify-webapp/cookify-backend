import _ from 'lodash';
import { Types, AggregatePaginateResult } from 'mongoose';

import { CommentInstanceInterface, CommentModelInterface } from '@models/comment';

export const listAll: (
  this: CommentModelInterface,
  page: number,
  perPage: number,
  post: string,
  type: string,
  username: string
) => Promise<AggregatePaginateResult<CommentInstanceInterface>> = async function (page, perPage, post, type, username) {
  const aggregate = this.aggregate<CommentInstanceInterface>()
    .match({
      post: new Types.ObjectId(post),
      type: _.capitalize(type),
    })
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
      isMe: { $eq: ['$author.username', username] },
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
    sort: type === 'snapshot' ? 'createdAt' : '-createdAt',
  });
};
