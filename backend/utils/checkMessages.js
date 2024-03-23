const Messages = require("../models/Messages");
const Users = require("../models/Users");

exports.checkMessages = async (conversationId) => {
  const messages = await Messages.find({ conversationId });
  const messageUserData = Promise.all(
    messages.map(async (message) => {
      const user = await Users.findById(message.senderId);
      return {
        user: {
          id: user._id,
          email: user.email,
          companyName: user.companyName,
          image: user.image,
        },
        hasRead: message.hasRead,
        message: {
          id: message._id,
          msg: message.message,
          msgImage: message?.image,
        },
        conversationId: conversationId,
      };
    })
  );
  return messageUserData;
};
