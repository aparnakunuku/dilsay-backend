const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const inviteSchema = mongoose.Schema(
    {
        sentTo: {
            type: ObjectId,
            ref: 'user',
            required: true,
        },
        sentBy: {
            type: ObjectId,
            ref: 'user',
            required: true,
        },
        inviteStatus: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending'
        },
        gameInfo: {
            type: ObjectId,
            ref: 'gameInfo',
        },
        chat: {
            type: ObjectId,
            ref: 'chat',
        }
    },
    { timestamps: true }
);
  
const inviteModel = mongoose.model("invite", inviteSchema);

module.exports = inviteModel;