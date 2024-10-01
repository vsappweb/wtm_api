const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(13);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user._id == req.params.id) {
      await user.deleteOne();
      res.status(200).json("Account has been deleted");
    } else {
      res.status(403).json("You can delete only your account!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const personnelnumber = req.query.personnelnumber;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ personnelnumber: personnelnumber });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a users !!!
router.get("/usersList", async (req, res) => {
  try {
    const users = await User.find({});
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user;
    });
    res.status(200).json(userMap);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id,  username, profilePicture, role } = friend;
      friendList.push({ _id,  username, profilePicture, role });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You allredy follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant follow yourself");
  }
});

//unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant unfollow yourself");
  }
});

module.exports = router;
