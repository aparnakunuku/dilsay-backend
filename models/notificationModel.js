const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notificationSchema = mongoose.Schema(
    {
        user: {
            type: ObjectId,
            ref: 'user',
            required: true
        },
        refUser: {
            type: ObjectId,
            ref: 'user',
        },
        imageId: {
            type: ObjectId,
        },
        body: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);
  
const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;