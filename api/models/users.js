const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String },
    username: { type: String, uniqueue: true },
  },
  { timestamps: true }
);

const userModel = model("User", userSchema);

module.exports = {
  User: userModel,
};
