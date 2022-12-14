const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const messageSchema = mongoose.Schema(
    {
        chat: {
            type: ObjectId,
            ref: "chat",
            required: true,
        },
        sender: {
            type: String,
            ref: "user",
            required: true,
        },
        body: {
            type: String,
        },
        type: {
            type: String,
            enum: ['Text', 'Image', 'Audio', 'Video'],
            required: true
        },
        refMessage: {
            type: ObjectId,
            ref: "message",
        },
    },
    { timestamps: true }
);
  
const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;