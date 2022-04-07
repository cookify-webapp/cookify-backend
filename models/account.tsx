import mongoose from "mongoose";

//---------------------
//   SCHEMA
//---------------------
const accountSchema = new mongoose.Schema({
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
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
  allergy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
  bookmark: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
});

//---------------------
//   METHODS
//---------------------
accountSchema.statics.findByName = () => mongoose.model("Account").find({});

export const Account = mongoose.model("Account", accountSchema);
