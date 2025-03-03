const router = require("express").Router();
const AIDialogue = require("../models/AiDialogue");

//CREATE 
router.post("/", async (req, res) => {
  const newDialogue = new AIDialogue(req.body);
  try {
    const savedDialogue = await newDialogue.save();
    res.status(200).json(savedDialogue);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id/update", async (req, res) => {
  try {
    const updatedDialogue = await AIDialogue.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } //returns updated dialogue
    );
    res.status(200).json(updatedDialogue);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await AIDialogue.findByIdAndDelete(req.params.id);
    res.status(200).json("The dialogue has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/", async (req, res) => {
  try {
    const dialogues = await AIDialogue.find();
    res.status(200).json(dialogues);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL DIALOGUES BY MODEL NAME AND USER
router.get("/:modelName/:userId", async (req, res) => {
  try {
    const dialogues = await AIDialogue.find({ modelName: req.params.modelName, userId: req.params.userId });
    res.status(200).json(dialogues);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;