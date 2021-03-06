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

//---------------------
//   INTERFACE
//---------------------
export interface CommentInterface extends Document {
  _id: Types.ObjectId;
  type: 'Recipe' | 'Snapshot';
  post: Types.ObjectId & (RecipeInstanceInterface | SnapshotInstanceInterface);
  author: Types.ObjectId & AccountInstanceInterface;
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
    author: {
      type: 'ObjectId',
      ref: 'Account',
      required: true,
      autopopulate: { select: 'username image' },
    },
    comment: { type: String, required: true, maxlength: constraint.comment.max },
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
//   INDEX
//---------------------
commentSchema.index({ post: 1, author: 1 }, { unique: true });

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
