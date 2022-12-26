const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
    {
        movieName: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);
  
const movieModel = mongoose.model("movie", movieSchema);

module.exports = movieModel;