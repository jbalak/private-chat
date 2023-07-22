const { Schema, Model, Types, model, Document } = require("mongoose");
const ObjectId = Types.ObjectId;

const messageSchema = new Schema(
  {
    text: { type: String, trim: true },
    conversation: { type: ObjectId, ref: "Conversation", index: true },
    sender: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: 1 });
messageSchema.index({ updatedAt: 1 });

const messageModel = model("Message", messageSchema);

module.exports = {
  Message: messageModel,
};
