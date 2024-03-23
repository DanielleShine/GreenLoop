const Conversations = require("../models/Conversations");
const Mesages = require("../models/Messages");
const Users = require("../models/Users");

/**
 *
 * @returns {Conversations} object with members: [senderId, receiverId]
 */
exports.conversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    let conversations = await Conversations.find({
      $or: [
        { members: { $eq: [senderId, receiverId] } },
        { members: { $eq: [receiverId, senderId] } },
      ],
    });
    if (!conversations.length) {
      const conversations = new Conversations({
        members: [senderId, receiverId],
      });
      await conversations.save();
      res.status(200).json(conversations);
    }
    res.status(200).json(conversations);
  } catch (error) {
    console.log(error, "Error");
  }
};

/**
 * Generate conversation between sender and receiver without selecting a user
 *
 * @param {receivedId} request query sent to url directly without form
 * @returns {any}
 */
exports.userConversation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });
    const conversationUserData = Promise.all(
      conversations.map(async (conversation) => {
        const senderId = conversation.members.find(
          (member) => member !== userId
        );
        const sender = await Users.findById(senderId);
        const messages = await Mesages.find({
          conversationId: conversation?._id,
        });
        return {
          conversation: {
            conversationId: conversation?._id,
            sender: {
              senderId: sender?._id,
              email: sender?.email,
              companyName: sender?.companyName,
              image: sender?.image,
            },
            messages,
          },
        };
      })
    );
    res.status(200).json(await conversationUserData);
  } catch (error) {
    console.log(error, "Error");
  }
};
