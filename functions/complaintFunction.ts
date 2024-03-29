import { AggregatePaginateResult } from 'mongoose';

import { ComplaintInstanceInterface, ComplaintModelInterface, ComplaintStatus } from '@models/complaints';
import { escapeRegex } from '@utils/utilFuncs';

export const listComplaint: (
  this: ComplaintModelInterface,
  page: number,
  perPage: number,
  searchWord: string,
  status: 'new' | 'processing' | 'done',
  moderator: string
) => Promise<AggregatePaginateResult<ComplaintInstanceInterface>> = async function (
  page,
  perPage,
  searchWord,
  status,
  moderator
) {
  const aggregate = this.aggregate()
    .addFields({
      post_string: { $toString: '$post' },
    })
    .match({
      post_string: { $regex: escapeRegex(searchWord), $options: 'i' },
      status:
        status === 'new'
          ? ComplaintStatus.FILED
          : status === 'processing'
          ? { $in: [ComplaintStatus.EXAMINING, ComplaintStatus.IN_PROGRESS, ComplaintStatus.VERIFYING] }
          : { $in: [ComplaintStatus.COMPLETED, ComplaintStatus.DELETED, ComplaintStatus.REJECTED] },
    })
    .project({ post_string: 0, expiresAt: 0 });

  if (status === 'processing')
    aggregate.addFields({
      isMe: { $eq: ['$moderator.username', moderator] },
    });

  return this.aggregatePaginate(aggregate, {
    page: page,
    limit: perPage,
    sort: status === 'processing' ? '-isMe -createdAt' : '-createdAt',
  });
};
