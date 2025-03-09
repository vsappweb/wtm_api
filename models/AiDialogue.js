const mongoose = require("mongoose");

const AiDialogueSchema = new mongoose.Schema(
  {
    modelName: {
      type: String,
    },
    userId: {
      type: String,
    },
    initId: {
      type: String,
    },
    dialogueTitle: {
      type: String,
    },
    messages: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiDialogue", AiDialogueSchema);