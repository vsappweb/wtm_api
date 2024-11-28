const router = require("express").Router();
const Group = require("../models/Group");
const User = require("../models/User");

//create a group
router.post("/", async (req, res) => {
  const newGroup = new Group(req.body);
  try {
    const savedGroup = await newGroup.save();
    res.status(200).json(savedGroup);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// update a group
router.put("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (group.userId === req.body.userId) {
      await group.updateOne({ $set: req.body });
      res.status(200).json("The group has been updated");
    } else {
      res.status(403).json("You can update only your group");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a group
router.delete("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    // if (group.userId === req.body.userId) {
    if (group._id == req.params.id) {
      await group.deleteOne();
      res.status(200).json("The group has been deleted");
    } else {
      res.status(403).json("You can delete only your group");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like/dislike a group
router.put("/:id/like", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group.likes.includes(req.body.userId)) {
      await group.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The group has been liked");
    } else {
      await group.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The group has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like/dislike a group
router.put("/:id/love", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group.loves.includes(req.body.userId)) {
      await group.updateOne({ $push: { loves: req.body.userId } });
      res.status(200).json("The group has been loved");
    } else {
      await group.updateOne({ $pull: { loves: req.body.userId } });
      res.status(200).json("The group has been disloved");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a group
// router.get("/:id", async (req, res) => {
//   try {
//     const group = await Group.findById(req.params.id);
//     res.status(200).json(group);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//GET ALL PLACES
router.get("/allGroups", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE ONE MEMBER
router.delete("/:id/member/delete", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json("Group not found");
    }
    const memberIndex = group.membersOfGroup.findIndex(
      (member) => member === req.body.membersOfGroup
    );
    if (memberIndex === -1) {
      return res.status(404).json(group.membersOfGroup);
    }
    group.membersOfGroup.splice(memberIndex, 1);
    await group.save();
    res.status(200).json("Member has been deleted...");
    if (group.membersOfGroup.length === 0) {
      await Group.findByIdAndDelete(req.params.id);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//GET USER GROUPS BY ID
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const groups = await Group.find({ membersOfGroup: userId });
    if (!groups) {
      return res.status(404).json({ message: "Group not found" });
    }
    const groupList = groups.map((group) => {
      const { _id, groupName, groupAdmin, membersOfGroup, pinsColor, createdAt } = group;
      return { _id, groupName, groupAdmin, membersOfGroup, pinsColor, createdAt };
    });
    res.status(200).json(groupList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
