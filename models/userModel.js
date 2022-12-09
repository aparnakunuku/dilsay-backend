const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const imageSchema = mongoose.Schema(
    {
        link: {
            type: String,
        },
        likeCount: {
            type: Number,
            default: 0
        },
        loveCount: {
            type: Number,
            default: 0
        },
        likes: [{
            type: ObjectId,
            ref: "user",
        }],
        loves: [{
            type: ObjectId,
            ref: "user",
        }],
    },
    { timestamps: true }
);

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        images: [imageSchema],
        phoneNumber: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
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
        interests: [{
            type: ObjectId,
            ref: "interest",
        }],
        verification: {
            verificationImage: {
                type: String,
            },
            isVerified: {
                type: Boolean,
                default: false,
            },
            verificationMessage: {
                type: String,
            },
        },
        isHideAge: {
            type: Boolean,
            default: false
        },
        invitesSentCount: {
            type: Number,
            default: 0
        },
        invitesAcceptedCount: {
            type: Number,
            default: 0
        },
        invitesSentTime: {
            type: Date,
        },
        invitesAcceptedTime: {
            type: Date,
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
        viewedProfiles: [{
            type: ObjectId,
            ref: 'user'
        }],
        blocked: [{
            type: ObjectId,
            ref: 'user'
        }],
        rejected: [{
            type: ObjectId,
            ref: 'user'
        }],
        blockedBy: [{
            type: ObjectId,
            ref: 'user'
        }],
        rejectedBy: [{
            type: ObjectId,
            ref: 'user'
        }],
        subscription: {
            package: {
                type: ObjectId,
                ref: "subscription",
            },
            subscribedAt: {
                type: Date,
            }
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