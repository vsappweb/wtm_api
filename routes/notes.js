const router = require("express").Router();
const Note = require("../models/Note");

//CREATE 
router.post("/", async (req, res) => {
  const newNote = new Note(req.body);
  try {
    const savedNote = await newNote.save();
    res.status(200).json(savedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id/update", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } //returns updated note
    );
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json("The note has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL NOTES BY USER
router.get("/:userId", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;