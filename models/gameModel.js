const mongoose = require("mongoose");

const levelSchema = mongoose.Schema(
    {
        level: {
            type: Number,
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
            unique: true
        },
        isFree: {
            type: Boolean,
            default: false,
        },
        levels: [levelSchema]
    },
    { timestamps: true }
);
  
const gameModel = mongoose.model("game", gameSchema);

module.exports = gameModel;