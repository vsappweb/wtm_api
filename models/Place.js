const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cityId: {
      type: String,
      required: true,
    },
    regionId: {
      type: String,
    },
    countryIsoCode_3: {
      type: String,
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
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Place", PlaceSchema);
