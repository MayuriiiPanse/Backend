const { Schema, model, Types } = require("mongoose");

const ChatSchema = new Schema(
  {
    foodId: { type: Types.ObjectId, ref: "Food", required: true, index: true },
    room: { type: String, required: true, index: true },
    sender: { type: Types.ObjectId, ref: "User", required: true },
    receiver: { type: Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    deliveredAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = model("Chat", ChatSchema);
