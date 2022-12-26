const mongoose = require("mongoose");

const interestSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);
  
const interestModel = mongoose.model("interest", interestSchema);

module.exports = interestModel;