const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    locationName: {
      type: String,
      min: 3,
      max: 20,
      unique: true,
    },
    isoCode_2: {
      type: String,
    },
    isoCode_3: {
      type: String,
    },
    locationPictures: {
      type: Array,
      default: [],
    },
    userId: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Country", CountrySchema);
