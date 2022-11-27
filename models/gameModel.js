const mongoose = require("mongoose");

const levelSchema = mongoose.Schema(
    {
        levelName: {
            type: String,
            required: true,
        },
        question1: {
            type: String,
            required: true,
        },
        question2: {
            type: String,
            required: true,
        },
        question3: {
            type: String,
            required: true,
        },
        question4: {
            type: String,
            required: true,
        },
        question5: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const gameSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },
        levels: levelSchema
    },
    { timestamps: true }
);
  
const gameModel = mongoose.model("game", gameSchema);

module.exports = gameModel;