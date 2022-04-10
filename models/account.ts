import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  model,
  Schema,
  Model,
  Document,
  QueryWithHelpers,
  Types,
} from "mongoose";

//---------------------
//   INTERFACE
//---------------------
export interface AccountInterface extends Document {
  username: string;
  email: string;
  password: string;
  accountType: "user" | "admin";
  imagePath: string;
  following: Types.Array<Types.ObjectId>;
  allergy: Types.Array<Types.ObjectId>;
  bookmark: Types.Array<Types.ObjectId>;
}

export interface AccountInstanceInterface extends AccountInterface {
  // declare any instance methods here
  comparePassword(
    this: AccountInstanceInterface,
    password: string
  ): Promise<boolean>;
  signToken(this: AccountInstanceInterface, secret: string): string;
}

export interface AccountModelInterface
  extends Model<AccountInstanceInterface, AccountQueryHelpers> {
  // declare any static methods here
}

interface AccountQueryHelpers {
  byName(
    this: QueryWithHelpers<any, AccountInstanceInterface, AccountQueryHelpers>,
    name: string
  ): QueryWithHelpers<
    AccountInstanceInterface,
    AccountInstanceInterface,
    AccountQueryHelpers
  >;
}

//---------------------
//   SCHEMA
//---------------------
const accountSchema = new Schema<
  AccountInstanceInterface,
  AccountModelInterface,
  AccountInstanceInterface,
  AccountQueryHelpers
>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  imagePath: String,
  following: [{ type: "ObjectId", ref: "Account" }],
  allergy: [{ type: "ObjectId", ref: "Ingredient" }],
  bookmark: [{ type: "ObjectId", ref: "Recipe" }],
});

//---------------------
//   METHODS
//---------------------
accountSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, decodeURIComponent(this.password));
};

accountSchema.methods.signToken = function (secret: string): string {
  return jwt.sign({ username: this.username }, secret, {
    expiresIn: "24h",
  });
};

//---------------------
//   QUERY HELPERS
//---------------------
accountSchema.query.byName = function (
  name: string
): QueryWithHelpers<
  AccountInstanceInterface,
  AccountInstanceInterface,
  AccountQueryHelpers
> {
  return this.where({ name });
};

export const Account = model<AccountInstanceInterface, AccountModelInterface>(
  "Account",
  accountSchema
);
