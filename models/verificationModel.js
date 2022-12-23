const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const verificationSchema = mongoose.Schema(
    {
        user: {
            type: ObjectId,
            ref: 'user',
            required: true,
        },
        verificationImage: {
            type: String,
        },
        verificationStatus: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending'
        },
        verificationMessage: {
            type: String,
        },
    },
    { timestamps: true }
);
  
const verificationModel = mongoose.model("verification", verificationSchema);

module.exports = verificationModel;