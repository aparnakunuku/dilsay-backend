const mongoose = require("mongoose");

const musicCategorySchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
  
const musicCategoryModel = mongoose.model("musicCategory", musicCategorySchema);

module.exports = musicCategoryModel;