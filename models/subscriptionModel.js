const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
    {
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
    },
    { timestamps: true }
);
  
const subscriptionModel = mongoose.model("subscription", subscriptionSchema);

module.exports = subscriptionModel;