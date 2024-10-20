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

// get timeline groups
// router.get("/timeline/:userId", async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.params.userId);
//     const userGroups = await Group.find({ userId: currentUser._id });
//     const friendGroups = await Promise.all(
//       currentUser.followings.map((friendId) => {
//         return Group.find({ userId: friendId });
//       })
//     );
//     res.status(200).json(userGroups.concat(...friendGroups));
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// get user's all groups
// router.get("/profile/:personnelnumber", async (req, res) => {
//   try {
//     const user = await User.findOne({
//       personnelnumber: req.params.personnelnumber,
//     });
//     const groups = await Group.find({ userId: user._id });
//     res.status(200).json(groups);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
