const router = require("express").Router();
const GroupRoom = require("../models/GroupRoom");

//new groupRoom
router.post("/", async (req, res) => {
  const newGroupRoom = new GroupRoom({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedGroupRoom = await newGroupRoom.save();
    res.status(200).json(savedGroupRoom);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get groupRoom of a user
router.get("/:userId", async (req, res) => {
  try {
    const groupRoom = await GroupRoom.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(groupRoom);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get groupRooms includes two user id
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const groupRoom = await GroupRoom.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(groupRoom);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a groupRoom
router.delete("/:id", async (req, res) => {
  try {
    const groupRoom = await GroupRoom.findById(req.params.id);
    if (groupRoom._id == req.params.id) {
      await groupRoom.deleteOne();
      res.status(200).json("The groupRoom has been deleted");
    } else {
      res.status(403).json("You can delete only your groupRoom");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
