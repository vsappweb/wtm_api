const router = require("express").Router();
const Map = require("../models/Map");

//CREATE 
router.post("/", async (req, res) => {
  const newMap = new Map(req.body);
  try {
    const savedMap = await newMap.save();
    res.status(200).json(savedMap);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id/update", async (req, res) => {
  try {
    const updatedMap = await Map.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } //returns updated map
    );
    res.status(200).json(updatedMap);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Map.findByIdAndDelete(req.params.id);
    res.status(200).json("Map has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE COORDINATE
router.delete("/:id/coordinate/delete", async (req, res) => {
  try {
    const map = await Map.findById(req.params.id);
    if (!map) {
      return res.status(404).json("Map not found");
    }
    const coordinateIndex = map.mapCoordinates.findIndex(
      (coordinate) => coordinate === req.body.mapCoordinates
    );
    if (coordinateIndex === -1) {
      return res.status(404).json(map.mapCoordinates);
    }
    map.mapCoordinates.splice(coordinateIndex, 1);
    await map.save();
    res.status(200).json("Coordinate has been deleted...");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// LIKE A MAP, DISLIKE A MAP
router.put("/:id/like", async (req, res) => {
  try {
    const map = await Map.findById(req.params.id);
    if (!map.likes.includes(req.body.userId)) {
      await map.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The map has been liked");
    } else {
      await map.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The map has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



//GET ALL COUNTRIES
router.get("/allMaps", async (req, res) => {
  try {
    const maps = await Map.find();
    res.status(200).json(maps);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET
// router.get("/:id", async (req, res) => {
//   try {
//     const map = await Map.findById(req.params.id);
//     res.status(200).json(map);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
