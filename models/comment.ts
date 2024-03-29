import {
  model,
  Schema,
  Document,
  Types,
  QueryWithHelpers,
  AggregatePaginateModel,
  AggregatePaginateResult,
} from 'mongoose';
import constraint from '@config/constraint';

import { AccountInstanceInterface } from '@models/account';
import { RecipeInstanceInterface } from '@models/recipe';
import { SnapshotInstanceInterface } from '@models/snapshot';
import { listAll } from '@functions/commentFunction';
import _ from 'lodash';

//---------------------
//   INTERFACE
//---------------------
export interface CommentInterface extends Document {
  _id: Types.ObjectId;
  type: 'Recipe' | 'Snapshot';
  post: Types.ObjectId & (RecipeInstanceInterface | SnapshotInstanceInterface);
  author: Pick<AccountInstanceInterface, '_id' | 'username' | 'image'>;
  comment: string;
  rating?: number;
  createdAt: Date;
}

export interface CommentInstanceMethods {
  // declare any instance methods here
}

export interface CommentInstanceInterface extends CommentInterface, CommentInstanceMethods {}

export interface CommentModelInterface extends AggregatePaginateModel<CommentInstanceInterface> {
  // declare any static methods here
  listAll: (
    page: number,
    perPage: number,
    post: string,
    type: string,
    username: string
  ) => Promise<AggregatePaginateResult<CommentInstanceInterface>>;
}

interface CommentQueryHelpers {
  byPost(
    this: QueryWithHelpers<any, CommentInstanceInterface, CommentQueryHelpers>,
    postId: string | Types.ObjectId
  ): QueryWithHelpers<CommentInstanceInterface, CommentInstanceInterface, CommentQueryHelpers>;
}

//---------------------
//   SCHEMA
//---------------------
const commentSchema = new Schema<
  CommentInstanceInterface,
  CommentModelInterface,
  CommentInstanceMethods,
  CommentQueryHelpers
>(
  {
    type: { type: String, enum: ['Recipe', 'Snapshot'], required: true },
    post: { type: 'ObjectId', refPath: 'type', required: true },
    author: { type: { _id: 'ObjectId', username: String, image: String }, required: true },
    comment: { type: String, maxlength: constraint.comment.max, validate: { validator: (v: any) => _.isString(v) } },
    rating: { type: Number, min: 0, max: 5 },
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production',
    collation: { locale: 'th' },
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

//---------------------
//   STATICS
//---------------------
commentSchema.statics.listAll = listAll;

//---------------------
//   QUERY HELPERS
//---------------------
commentSchema.query.byPost = function (
  postId: string | Types.ObjectId
): QueryWithHelpers<CommentInstanceInterface, CommentInstanceInterface, CommentQueryHelpers> {
  return this.where({ post: postId });
};

//---------------------
//   MODEL
//---------------------
export const Comment = model<CommentInstanceInterface, CommentModelInterface>('Comment', commentSchema);
