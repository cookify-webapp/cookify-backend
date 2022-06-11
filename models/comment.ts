import { model, Schema, Model, Document, Types, QueryWithHelpers } from 'mongoose';
import constraint from '@config/constraint';

//---------------------
//   INTERFACE
//---------------------
export interface CommentInterface extends Document {
  _id: Types.ObjectId;
  type: 'Recipe' | 'Snapshot';
  post: Types.ObjectId;
  author: Types.ObjectId;
  comment: string;
  rating?: number;
  createdAt: Date;
}

export interface CommentInstanceMethods {
  // declare any instance methods here
}

export interface CommentInstanceInterface extends CommentInterface, CommentInstanceMethods {}

export interface CommentModelInterface extends Model<CommentInstanceInterface, CommentQueryHelpers> {
  // declare any static methods here
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
    rating: { type: Number, min: 1, max: 5 },
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production',
    collation: { locale: 'th' },
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

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
