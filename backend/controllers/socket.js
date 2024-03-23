const io = require("socket.io")(process.env.SOCKET_PORT, {
  cors: {
    origin: "*",
  },
});
const Users = require("../models/Users");
const Conversations = require("../models/Conversations");
const { checkMessages } = require("../utils/checkMessages");

let users = [];
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await Users.findById(senderId);
      if (receiver) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email },
          });
      } else {
        io.to(sender.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
          receiverId,
          user: { id: user._id, fullName: user.fullName, email: user.email },
        });
      }
    }
  );

  socket.on("getNewMessages", async (userId) => {
    const checkConversation = await Conversations.find({
      members: { $in: [userId] },
    });

    if (checkConversation.length > 0) {
      const messages = await checkMessages(checkConversation[0]._id);
      const newMessages = messages.filter(
        (message) => !message.hasRead && message.user.id.toString() !== userId
      );
      io.to(socket.id).emit("getNewMessages", newMessages);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});
