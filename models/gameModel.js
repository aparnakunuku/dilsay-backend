const mongoose = require("mongoose");

const questionsSchema = mongoose.Schema(
    {
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

const levelSchema = mongoose.Schema(
    {
        level: {
            type: Number,
            required: true,
            unique: true
        },
        questions: [questionsSchema],
    },
    { timestamps: true }
);

const gameSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true
        },
        levels: [levelSchema]
    },
    { timestamps: true }
);
  
const gameModel = mongoose.model("game", gameSchema);

module.exports = gameModel;