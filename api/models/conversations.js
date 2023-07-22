const { Schema, Model, Types, model, Document } = require("mongoose");
const ObjectId = Types.ObjectId;

const conversationSchema = new Schema(
  {
    title: { type: String, trim: true },
    participants: [{ type: ObjectId, required: true, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const conversationModel = model("Conversation", conversationSchema);

module.exports = {
  Conversation: conversationModel,
};
