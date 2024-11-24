const router = require("express").Router();
const Favorite = require("../models/Favorite");
const User = require("../models/User");

//create a favorite
router.post("/", async (req, res) => {
  const newFavorite = new Favorite(req.body);
  try {
    const savedFavorite = await newFavorite.save();
    res.status(200).json(savedFavorite);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// update a favorite
router.put("/:id", async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (favorite.userId === req.body.userId) {
      await favorite.updateOne({ $set: req.body });
      res.status(200).json("The favorite has been updated");
    } else {
      res.status(403).json("You can update only your favorite");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a favorite
router.delete("/:id", async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    // if (favorite.userId === req.body.userId) {
    if (favorite._id == req.params.id) {
      await favorite.deleteOne();
      res.status(200).json("The favorite has been deleted");
    } else {
      res.status(403).json("You can delete only your favorite");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like/dislike a favorite
router.put("/:id/like", async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite.likes.includes(req.body.userId)) {
      await favorite.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The favorite has been liked");
    } else {
      await favorite.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The favorite has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like/dislike a favorite
router.put("/:id/love", async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite.loves.includes(req.body.userId)) {
      await favorite.updateOne({ $push: { loves: req.body.userId } });
      res.status(200).json("The favorite has been loved");
    } else {
      await favorite.updateOne({ $pull: { loves: req.body.userId } });
      res.status(200).json("The favorite has been disloved");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET ALL PLACES
router.get("/allFavorites", async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
