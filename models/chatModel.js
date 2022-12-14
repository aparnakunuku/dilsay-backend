const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const chatSchema = mongoose.Schema(
    {
        users: [{ 
            type: ObjectId, 
            ref: "user" 
        }],
        latestMessage: {
            type: ObjectId,
            ref: "message",
        },
    },
    { timestamps: true }
);
  
const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;