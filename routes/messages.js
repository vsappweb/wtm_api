const router = require("express").Router();
const Message = require("../models/Message");

//add a message
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a messages for a groupRoom
router.get("/:groupRoomId", async (req, res) => {
  try {
    const messages = await Message.find({
      groupRoomId: req.params.groupRoomId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
