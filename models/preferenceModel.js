const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const preferenceSchema = mongoose.Schema(
    {
        user: {
            type: ObjectId,
            ref: 'user',
            required: true
        },
        gender: {
            type: String,
        },
        startAge: {
            type: Number,
        },
        endAge: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
        latitude: {
            type: Number,
        },
        
    },
    { timestamps: true }
);
  
const preferenceModel = mongoose.model("preference", preferenceSchema);

module.exports = preferenceModel;