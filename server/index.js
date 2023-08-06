const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const app = express();
const socket = require("socket.io");
const AllChats = require("./database/AllChatsModel");
const Message = require("./database/MessageModel");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB Connection Successful`);
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (username) => {
    console.log(username);
    onlineUsers.set(username, socket.id);
  });

  socket.on("send-msg", async (data) => {
    console.log({ data });
    const user_id = new mongoose.Types.ObjectId(data.chat_id);
    const chat = await AllChats.findById(user_id);
    if (data.chat_id) {
      chat.Members.map((username) => {
        console.log(username);
        const sendUserSocket = onlineUsers.get(username);
        console.log(sendUserSocket);
        if (sendUserSocket) {
          console.log(sendUserSocket);
          console.log({ id: "chat" });
          socket.to(sendUserSocket).emit("msg-recieve", chat);
        }
      });
    }
  });
});
