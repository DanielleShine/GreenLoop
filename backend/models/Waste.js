const mongoose = require("mongoose");

const wasteSCheme = mongoose.Schema(
  {
    post: {
      type: String,
      required: [true, "Please write something about the waste"],
      maxLength: 200,
    },
    wasteCategory: {
      type: String,
      required: [true, "Please select a category"],
      maxLength: 40,
    },
    image: {
      public_id: {
        type: String,
        required: [true, "Please upload an image"],
      },
      url: {
        type: String,
        required: [true, "Please upload an image"],
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Waste = mongoose.model("Waste", wasteSCheme);

module.exports = Waste;
