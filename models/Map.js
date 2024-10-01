const mongoose = require("mongoose");

const MapSchema = new mongoose.Schema(
  {
    creatorID: {
      type: String,
    },
    country: {
      type: String,
    },
    countryId: {
      type: String,
    },
    region: {
      type: String,
    },
    regionId: {
      type: String,
    },
    city: {
      type: String,
    },
    cityId: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    asn: {
      type: String,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Map", MapSchema);
