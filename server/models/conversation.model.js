const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Sender id is required"],
      ref: "Users",
    },
    receiver_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Receiver id is required"],
      ref: "Users",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Messages",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
