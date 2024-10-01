const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      max: 200,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    loves: {
      type: Array,
      default: [],
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
