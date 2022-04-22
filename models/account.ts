import { comparePassword, signToken } from '@functions/account';

import { model, Schema, Model, Document, QueryWithHelpers, Types } from 'mongoose';

import { SnapshotInstanceInterface } from '@models/snapshot';
import { RecipeInstanceInterface } from '@models/recipe';

//---------------------
//   INTERFACE
//---------------------
export interface AccountInterface extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  accountType: 'user' | 'admin';
  image?: string;
  following: Types.Array<Types.ObjectId>;
  allergy: Types.Array<Types.ObjectId>;
  bookmark: Types.Array<Types.ObjectId>;
  recipes?: Types.Array<RecipeInstanceInterface>;
  likedRecipes?: Types.Array<RecipeInstanceInterface>;
  snapshots?: Types.Array<SnapshotInstanceInterface>;
}

export interface AccountInstanceMethods {
  // declare any instance methods here
  comparePassword: (this: AccountInstanceInterface, password: string) => Promise<boolean>;
  signToken: (this: AccountInstanceInterface, secret: string) => string;
}

export interface AccountInstanceInterface extends AccountInterface, AccountInstanceMethods {}

export interface AccountModelInterface extends Model<AccountInstanceInterface, AccountQueryHelpers> {
  // declare any static methods here
}

interface AccountQueryHelpers {
  byName(
    this: QueryWithHelpers<any, AccountInstanceInterface, AccountQueryHelpers>,
    name: string
  ): QueryWithHelpers<AccountInstanceInterface, AccountInstanceInterface, AccountQueryHelpers>;
}

//---------------------
//   SCHEMA
//---------------------
export const accountSchema = new Schema<
  AccountInstanceInterface,
  AccountModelInterface,
  AccountInstanceInterface,
  AccountQueryHelpers
>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountType: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    image: { type: String, default: null },
    following: [{ type: 'ObjectId', ref: 'Account' }],
    allergy: [{ type: 'ObjectId', ref: 'Ingredient' }],
    bookmark: [{ type: 'ObjectId', ref: 'Recipe' }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//---------------------
//   QUERY HELPERS
//---------------------
accountSchema.query.byName = function (
  name: string
): QueryWithHelpers<AccountInstanceInterface, AccountInstanceInterface, AccountQueryHelpers> {
  return this.where({ username: name });
};

//---------------------
//   METHODS
//---------------------
accountSchema.methods.comparePassword = comparePassword;
accountSchema.methods.signToken = signToken;

//---------------------
//   VIRTUAL
//---------------------
accountSchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'author',
});

accountSchema.virtual('likedRecipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'likedBy',
});

accountSchema.virtual('snapshots', {
  ref: 'Snapshot',
  localField: '_id',
  foreignField: 'author',
});

//---------------------
//   MODEL
//---------------------
export const Account = model<AccountInstanceInterface, AccountModelInterface>('Account', accountSchema);
