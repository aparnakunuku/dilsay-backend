const mongoose = require("mongoose");

const featuresSchema = mongoose.Schema(
    {
        isHideAge: {
            type: Boolean,
            required: false
        },
        isLimitedInvites: {
            type: Boolean,
            required: false
        },
        isLimitedAccepts: {
            type: Boolean,
            required: false
        },
        isLocationChange: {
            type: Boolean,
            required: false
        },
        isNoAds: {
            type: Boolean,
            required: false
        },
        isGameTries: {
            type: Boolean,
            required: false
        }
    },
    { timestamps: true }
);

const subscriptionSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        validityPeriod: {
            type: String,
            required: true,
            enum: ["7d", "30d", "90d"]
        },
        discount: {
            type: Number,
        },
        isActive: {
            type: Boolean,
            default: false
        },
        features: featuresSchema
    },
    { timestamps: true }
);
  
const subscriptionModel = mongoose.model("subscription", subscriptionSchema);

module.exports = subscriptionModel;