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
module.exports=mongoose.model("Message",chatSchema);
