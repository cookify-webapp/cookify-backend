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
      localField: 'author',
      foreignField: '_id',
      as: 'author',
      pipeline: [{ $project: { username: 1, image: 1 } }],
    })
    .unwind({
      path: '$author',
      preserveNullAndEmptyArrays: true,
    })
    .addFields({
      isMe: { $eq: ['$author.username', username] },
    });

  return this.aggregatePaginate(aggregate, {
    page,
    limit: perPage,
    sort: '-createdAt',
  });
};
