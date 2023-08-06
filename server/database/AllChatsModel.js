const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    isattachment: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const contactSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    required: true,
  },
  Name: {
    type: String,
  },
  Members: {
    type: [String],
    default: [],
  },
  Chats: {
    type: [chatSchema],
    default: [],
  },
});
module.exports = mongoose.model("AllChats", contactSchema);
