const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const musicSchema = mongoose.Schema(
    {
        musicName: {
            type: String,
            required: true
        },
        audioLink: {
            type: String,
            required: true
        },
        categoryName: {
            type: ObjectId,
            ref: "musicCategory",
            required: true,
        },
    },
    { timestamps: true }
);
  
const musicModel = mongoose.model("music", musicSchema);

module.exports = musicModel;