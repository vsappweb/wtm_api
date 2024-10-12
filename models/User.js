const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      min: 3,
      max: 20,
    },
    language: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 50,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followings: {
      type: Array,
      default: [],
    },
    inGroup: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    ghostnumber: {
      type: String,
    },
    ghostname: {
      type: String,
    },
    ghostname: {
      type: String,
    },
    ghostname: {
      type: String,
    },
    ghostname: {
      type: String,
    },
    ghostname: {
      type: String,
    },
    membershipAdmin: {
      type: String,
    },
    membershipGroup: {
      type: Array,
      default: [],
    },
    membershipRole: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    membershipDate: {
      
      type: Date,
    },
    ghostMemberships: {
      type: Array,
      default: [],
    },
    role: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
