const User = require("../database/userModel");
const bcrypt = require("bcrypt");
const AllChats = require("../database/AllChatsModel");
const Message = require("../database/MessageModel");
const mongoose = require("mongoose");

module.exports.sendmsg = async (req, res, next) => {
  try {
    const { sender, isattachment, message, chat_id } = req.body;
    const msg = await Message.create({
      sender: sender,
      isattachment: isattachment,
      message: message,
    });
    const user_id = new mongoose.Types.ObjectId(chat_id);
    const chat = await AllChats.updateOne(
      { _id: user_id },
      { $push: { Chats: msg } }
    );
    console.log(chat);
    return res.json({ status: true, chat });
  } catch (er) {
    next(er);
  }
};

module.exports.newchats = async (req, res, next) => {
  try {
    const { email, requester } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        msg: "Invalid Email, User with this email doesnot exist",
        status: false,
      });
    if (user.username === requester)
      return res.json({
        msg: "Cannot Create account with self",
        status: false,
      });
    const chat = await AllChats.findOne({
      Name: "",
      $or: [
        { Members: [user.username, requester] },
        { Members: [requester, user.username] },
      ],
    });
    if (chat) {
      return res.json({
        msg: "Chat with that user already exists",
        status: false,
      });
    }
    const newchat = await AllChats.create({
      isGroup: false,
      Name: "",
      Members: [user.username, requester],
      Chats: [],
    });
    return res.json({ status: true, newchat });
  } catch (er) {
    next(er);
  }
};

module.exports.contacts = async (req, res, next) => {
  try {
    const user_id = new mongoose.Types.ObjectId(req.params.id);
    const user = await User.findById(user_id);
    const allchats = await AllChats.find({ Members: { $in: [user.username] } });
    return res.json({ allchats });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Invalid username or Password", status: false });
    const passcheck = await bcrypt.compare(password, user.password);
    if (!passcheck)
      return res.json({ msg: "Invalid username or Password", status: false });
    return res.json({ status: true, user });
  } catch (er) {
    next(er);
  }
};
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, hashedpassword } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const user = await User.create({
      username,
      email,
      password: hashedpassword,
    });
    return res.json({ status: true, user });
  } catch (er) {
    next(er);
  }
};
