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
    nameOfMap: {
      type: String,
    },
    canBeDeleted: {
      type: Boolean,
      default: false,
    },
    createByUser: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Map", MapSchema);
