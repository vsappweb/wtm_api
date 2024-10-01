const router = require("express").Router();
const Region = require("../models/Region");

//CREATE 
router.post("/", async (req, res) => {
  const newRegion = new Region(req.body);
  try {
    const savedRegion = await newRegion.save();
    res.status(200).json(savedRegion);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id/update", async (req, res) => {
  try {
    const updatedRegion = await Region.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } //returns updated region
    );
    res.status(200).json(updatedRegion);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET
// router.get("/:id", async (req, res) => {
//   try {
//     const region = await Region.findById(req.params.id);
//     res.status(200).json(region);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//DELETE
router.delete("/:id/delete", async (req, res) => {
  try {
    await Region.findByIdAndDelete(req.params.id);
    res.status(200).json("Region has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE ONE PICTURE
router.delete("/:id/picture/delete", async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) {
      return res.status(404).json("Region not found");
    }
    const pictureIndex = region.locationPictures.findIndex(
      (picture) => picture === req.body.locationPictures
    );
    if (pictureIndex === -1) {
      return res.status(404).json(region.locationPictures);
    }
    region.locationPictures.splice(pictureIndex, 1);
    await region.save();
    res.status(200).json("Picture has been deleted...");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});



//GET ALL COUNTRIES
router.get("/allRegions", async (req, res) => {
  try {
    const regions = await Region.find();
    res.status(200).json(regions);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
