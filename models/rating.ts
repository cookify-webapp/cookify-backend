import { model, Schema, Model, Document, Types, QueryWithHelpers } from 'mongoose';

//---------------------
//   INTERFACE
//---------------------
export interface RatingInterface extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  author: Types.ObjectId;
  rating: number;
}

export interface RatingInstanceMethods {
  // declare any instance methods here
}

export interface RatingInstanceInterface extends RatingInterface, RatingInstanceMethods {}

export interface RatingModelInterface extends Model<RatingInstanceInterface, RatingQueryHelpers> {
  // declare any static methods here
}

interface RatingQueryHelpers {
  byPost(
    this: QueryWithHelpers<any, RatingInstanceInterface, RatingQueryHelpers>,
    postId: string | Types.ObjectId
  ): QueryWithHelpers<RatingInstanceInterface, RatingInstanceInterface, RatingQueryHelpers>;
}

//---------------------
//   SCHEMA
//---------------------
const ratingSchema = new Schema<
  RatingInstanceInterface,
  RatingModelInterface,
  RatingInstanceMethods,
  RatingQueryHelpers
>(
  {
    post: { type: 'ObjectId', ref: 'Recipe', required: true },
    author: { type: 'ObjectId', ref: 'Account', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { collation: { locale: 'th' } }
);

//---------------------
//   QUERY HELPERS
//---------------------
ratingSchema.query.byPost = function (
  postId: string | Types.ObjectId
): QueryWithHelpers<RatingInstanceInterface, RatingInstanceInterface, RatingQueryHelpers> {
  return this.where({ post: postId });
};

//---------------------
//   MODEL
//---------------------
export const Rating = model<RatingInstanceInterface, RatingModelInterface>('Rating', ratingSchema);
