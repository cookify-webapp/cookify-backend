import { model, Schema, Model, Document, Callback } from "mongoose";

//---------------------
//   INTERFACE
//---------------------
export interface AccountInterface extends Document {
  username: string;
  email: string;
  password: string;
  accountType: "user" | "admin";
  imagePath: string;
  following: Schema.Types.ObjectId[];
  allergy: Schema.Types.ObjectId[];
  bookmark: Schema.Types.ObjectId[];
}

export interface AccountInstanceInterface extends AccountInterface {
  // declare any instance methods here
}

export interface AccountModelInterface extends Model<AccountInstanceInterface> {
  // declare any static methods here
  findByUsername(
    username: string,
    callback: Callback<AccountInstanceInterface>,
    projection?: string | Object,
    populate?: string
  ): void;
  findByUsernameAndPassword(
    username: string,
    password: string,
    callback: Callback<AccountInstanceInterface>,
    projection?: string | Object,
    populate?: string
  ): void;
}

//---------------------
//   SCHEMA
//---------------------
const accountSchema = new Schema<
  AccountInstanceInterface,
  AccountModelInterface
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
  following: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  allergy: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
  bookmark: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
});

//---------------------
//   METHODS
//---------------------
accountSchema.statics.findByUsername = function (
  username: string,
  callback: Callback,
  projection?: string | Object,
  populate?: string
) {
  const query = this.findOne({
    username: username,
  });
  if (populate) {
    query.populate(populate);
  }
  if (projection) {
    query.select(projection);
  }
  query.exec(callback);
};


accountSchema.statics.findByUsernameAndPassword = function (
  username: string,
  password: string,
  callback: Callback,
  projection?: string | Object,
  populate?: string
) {
  const query = this.findOne({
    username: username,
    password: password,
  });
  if (populate) {
    query.populate(populate);
  }
  if (projection) {
    query.select(projection);
  }
  query.exec(callback);
};

export const Account = model<AccountInstanceInterface, AccountModelInterface>(
  "Account",
  accountSchema
);
