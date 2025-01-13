const mongoose = require("mongoose");

const GroupRoomSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupRoom", GroupRoomSchema);
