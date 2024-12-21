const router = require("express").Router();
const Place = require("../models/Place");
const User = require("../models/User");

//create a place
router.post("/", async (req, res) => {
  const newPlace = new Place(req.body);
  try {
    const savedPlace = await newPlace.save();
    res.status(200).json(savedPlace);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// update a place
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const place = await Place.findById(req.params.id);
    if (place.userId === req.body.userId) {
      await place.updateOne({ $set: req.body });
      res.status(200).json("The place has been updated by owner");
    } else if (user.isAdmin || user.role === "0" || user.role === "007") {
      await place.updateOne({ $set: req.body });
      res.status(200).json("The place has been updated by admin");
    } else {
      res.status(403).json("If you not the admin you can update only your place");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a place
router.delete("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    // if (place.userId === req.body.userId) {
    if (place._id == req.params.id) {
      await place.deleteOne();
      res.status(200).json("The place has been deleted");
    } else {
      res.status(403).json("You can delete only your place");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like/dislike a place
router.put("/:id/like", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place.likes.includes(req.body.userId)) {
      await place.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The place has been liked");
    } else {
      await place.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The place has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like/dislike a place
router.put("/:id/love", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place.loves.includes(req.body.userId)) {
      await place.updateOne({ $push: { loves: req.body.userId } });
      res.status(200).json("The place has been loved");
    } else {
      await place.updateOne({ $pull: { loves: req.body.userId } });
      res.status(200).json("The place has been disloved");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a place
// router.get("/:id", async (req, res) => {
//   try {
//     const place = await Place.findById(req.params.id);
//     res.status(200).json(place);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//GET ALL PLACES
router.get("/allPlaces", async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get timeline places
// router.get("/timeline/:userId", async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.params.userId);
//     const userPlaces = await Place.find({ userId: currentUser._id });
//     const friendPlaces = await Promise.all(
//       currentUser.followings.map((friendId) => {
//         return Place.find({ userId: friendId });
//       })
//     );
//     res.status(200).json(userPlaces.concat(...friendPlaces));
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// get user's all places
// router.get("/profile/:personnelnumber", async (req, res) => {
//   try {
//     const user = await User.findOne({
//       personnelnumber: req.params.personnelnumber,
//     });
//     const places = await Place.find({ userId: user._id });
//     res.status(200).json(places);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
