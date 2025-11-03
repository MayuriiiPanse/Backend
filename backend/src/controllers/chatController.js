const Chat = require("../models/chatSchema");

exports.getByFood = async (req, res) => {
  const { foodId } = req.params;
  const list = await Chat.find({ foodId }).sort({ createdAt: 1 });
  res.json({
    items: list.map((d) => ({
      id: String(d._id),
      foodId: String(d.foodId),
      text: d.message,
      senderId: String(d.sender),
      receiverId: String(d.receiver),
      createdAt: d.createdAt
    }))
  });
};
