const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const questionsSchema = mongoose.Schema(
    {
        gameCategory: {
            type: ObjectId,
            ref: 'game',
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        option1: {
            type: String,
            default: 'Yes'
        },
        option2: {
            type: String,
            default: 'No'
        },
    },
    { timestamps: true }
);

  
const questionModel = mongoose.model("question", questionsSchema);

module.exports = questionModel;