const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    groupAdmin: {
      type: String,
    },
    groupName: {
      type: String,
    },
    membersOfGroup: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
