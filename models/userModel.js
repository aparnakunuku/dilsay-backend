const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            unique: true
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"]
        },
        jobTitle: {
            type: String
        },
        dob: {
            type: Date
        },
        bio: {
            type: String
        },
        intrests: {
            type: ObjectId,
            ref: "interest",
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isOnline: {
            type: Boolean,
            default: false
        },
        location: {
            type: {
              type: String,
              enum: ['Point'],
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
        },
        blockedBy: [{
            type: ObjectId,
            ref: 'user'
        }],
        rejectedBy: [{
            type: ObjectId,
            ref: 'user'
        }],
        subscription: {
            type: ObjectId,
            ref: "subscription",
        },
        userType: {
            type: String,
            enum: ["Super Admin", "User"],
            required: true
        },
    },
    { timestamps: true }
);
  
userSchema.index({ "location": "2dsphere" });
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;