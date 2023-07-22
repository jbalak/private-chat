const { forEach, isEmpty } = require("lodash");
const {
  createAConversationSocket,
  sendAMessageSocket,
} = require("../api/conversations");

const { isDef, socketSuccessHandler } = require("../api/helpers");

exports.createAConversationEmit = async (
  socket,
  conversationData,
  event,
  cb
) => {
  try {
    let conversation = await createAConversationSocket(conversationData);
    console.log({ conversation });
    let { participants } = conversation;

    socketSuccessHandler(participants, event, conversation, socket)
      .then(console.log)
      .catch(console.log);

    cb(conversation);
  } catch (error) {
    console.log(error);
  }
};

exports.sendMessageAndEmit = async (socket, event, messageData, cb) => {
  try {
    console.log({ beforeSocketMessages: JSON.stringify(messageData, null, 2) });
    let message = await sendAMessageSocket(messageData);

    //EMIT MESSAGE to ALL LISTENING CHANNELS OR GROUPS OR CONVERSATIONS

    const userIds = message?.conversation?.participants;
    socketSuccessHandler(userIds, event, message, socket)
      .then(console.log)
      .catch(console.log);

    cb(message);
  } catch (error) {
    console.log(error);
  }
};
