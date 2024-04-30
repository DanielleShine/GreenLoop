const mongoose = require("mongoose");

const wasteSchema = mongoose.Schema(
  {
    post: {
      type: String,
      required: [true, "Please write something about the waste"],
      maxlength: 200,
    },
    wasteCategory: {
      type: String,
      required: [true, "Please select a category"],
      maxlength: 40,
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
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Waste = mongoose.model("Waste", wasteSchema);

module.exports = Waste;
