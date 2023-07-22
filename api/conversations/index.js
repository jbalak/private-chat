const { Conversation } = require("../models/conversations");
const { Message } = require("../models/messages");
const { User } = require("../models/users");

exports.createAConversationSocket = async (conversation) => {
  try {
    const { participants, title, sender } = conversation;

    const conversationData = {
      participants,
      title,
    };

    const createdConversation = await new Conversation(conversationData).save();

    return createdConversation;
  } catch (error) {
    throw new Error(error);
  }
};

exports.sendAMessageSocket = async (messageData) => {
  try {
    const { text, conversation, sender } = messageData;

    const messageObject = {
      text,
      conversation,
      sender,
    };

    let conversationData = await Conversation.findById(conversation).lean();

    let message = await new Message(messageObject).save();

    message = message.toObject();
    message.conversation = conversationData;
    return message;
  } catch (error) {
    throw new Error(error);
  }
};
