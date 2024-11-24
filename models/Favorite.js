const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    isoCode_3: {
      type: String,
    },
    countries: {
      type: Array,
      default: [],
    },
    regions: {
      type: Array,
      default: [],
    },
    cities: {
      type: Array,
      default: [],
    },
    trails: {
      type: Array,
      default: [],
    },
    places: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorite", FavoriteSchema);
