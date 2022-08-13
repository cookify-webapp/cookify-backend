import { model, Schema, Document, QueryWithHelpers, Types, PaginateModel } from 'mongoose';

import { SnapshotInstanceInterface } from '@models/snapshot';
import { RecipeInstanceInterface } from '@models/recipe';
import { comparePassword, hashPassword, signToken } from '@functions/accountFunction';
import constraint from '@config/constraint';

//---------------------
//   INTERFACE
//---------------------
export interface AccountInterface extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  accountType: 'user' | 'admin' | 'pending';
  image: string;
  following?: Types.Array<Types.ObjectId>;
  allergy: Types.Array<Types.ObjectId>;
  bookmark: Types.Array<Types.ObjectId>;
  recipes?: Types.Array<RecipeInstanceInterface>;
  snapshots?: Types.Array<SnapshotInstanceInterface>;
}

export interface AccountInstanceMethods {
  // declare any instance methods here
  comparePassword: (this: AccountInstanceInterface, password: string) => Promise<boolean>;

  hashPassword: (this: AccountInstanceInterface) => Promise<void>;

  signToken: (this: AccountInstanceInterface, secret: string) => string;
}

export interface AccountInstanceInterface extends AccountInterface, AccountInstanceMethods {}

export interface AccountModelInterface extends PaginateModel<AccountInstanceInterface, AccountQueryHelpers> {
  // declare any static methods here
}

interface AccountQueryHelpers {
  byName(
    this: QueryWithHelpers<any, AccountInstanceInterface, AccountQueryHelpers>,
    name?: string
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
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: constraint.username.min,
      maxlength: constraint.username.max,
    },
    email: { type: String, required: true, unique: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    password: { type: String, select: false, match: /^%242[ab]%2410%24\S{53,}/ },
    accountType: {
      type: String,
      required: true,
      enum: {
        values: ['user', 'admin', 'pending'],
        message: 'accountType must be either `user`, `pending` or `admin`',
      },
      default: 'user',
    },
    image: { type: String, default: '' },
    following: [{ type: 'ObjectId', ref: 'Account' }],
    allergy: [{ type: 'ObjectId', ref: 'Ingredient' }],
    bookmark: [{ type: 'ObjectId', ref: 'Recipe' }],
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production',
    collation: { locale: 'th' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

//---------------------
//   QUERY HELPERS
//---------------------
accountSchema.query.byName = function (
  name?: string
): QueryWithHelpers<AccountInstanceInterface, AccountInstanceInterface, AccountQueryHelpers> {
  if (!name) return this;
  return this.where({ username: name });
};

//---------------------
//   METHODS
//---------------------
accountSchema.methods.comparePassword = comparePassword;
accountSchema.methods.signToken = signToken;
accountSchema.methods.hashPassword = hashPassword;

//---------------------
//   VIRTUAL
//---------------------
accountSchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'author',
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
