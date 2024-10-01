const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
  {
    locationName: {
      type: String,
      min: 3,
      max: 20,
      unique: true,
    },
    locationPictures: {
      type: Array,
      default: [],
    },
    userId: {
      type: Array,
      default: [],
    },
    countryIsoCode_3: {
      type: String,
    },
    regionId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", CitySchema);
