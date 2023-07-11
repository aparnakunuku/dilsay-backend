const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

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

const answersSchema = mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const gameInfoSchema = mongoose.Schema(
    {
        gameCategory: {
            type: ObjectId,
            ref: 'game',
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending'
        },
        bothUserAnsweredGame: {
            type: Boolean,
            default: null
        },
        gameAnswersMatched: {
            type: Boolean,
            default: null
        },
        gameLevel: {
            type: Number,
            default: 1,
        },
        tries: {
            type: Number,
            default: 0,
        },
        user1: {
            type: ObjectId,
            ref: 'user',
            required: true,
        },
        user2: {
            type: ObjectId,
            ref: 'user',
            required: true,
        },
        gameAnsweredBy: [{
            type: ObjectId,
            ref: 'user',
        }],
        answers: [answersSchema],
        questions: [questionsSchema]
    },
    { timestamps: true }
);
  
const gameInfoModel = mongoose.model("gameInfo", gameInfoSchema);

module.exports = gameInfoModel;