const { createAConversationEmit, sendMessageAndEmit } = require("./chat");

const socket = (io) => {
  io.on("connection", (socket) => {
    try {
      let { source } = socket?.handshake?.headers;

      let socketId = socket.id;

      // join user to room
      socket.join(socketId);
      socket.join("test_id");

      //to receive send a new conversation
      socket.on("createAConversation", async (conversationData, cb) => {
        const event = "createAConversation";
        await createAConversationEmit(socket, conversationData, event, cb);
      });

      //to receive send a new message
      socket.on("sendAMessage", async (messageData, cb) => {
        let event = "sendAMessage";
        await sendMessageAndEmit(socket, event, messageData, cb);
      });

      // removing all the users socketids from redis on disconnect
      socket.on("disconnect", async () => {
        console.log("socket with id " + socket.id + " removed/disconnected");
      });
    } catch (error) {
      console.log(error);
      let socketErr = socketErrHandler(error);
      socket.emit("err", socketErr);
    }
  });

  // workspaces.on("connect_error", (err) => socketErrHandler(err));
  // workspaces.on("connect_failed", (err) => socketErrHandler(err));
  // workspaces.on("disconnect", (err) => socketErrHandler(err));
};

module.exports = { socket };
