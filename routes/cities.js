const router = require("express").Router();
const City = require("../models/City");

//CREATE 
router.post("/", async (req, res) => {
  const newCity = new City(req.body);
  try {
    const savedCity = await newCity.save();
    res.status(200).json(savedCity);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id/update", async (req, res) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } //returns updated city
    );
    res.status(200).json(updatedCity);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET
// router.get("/:id", async (req, res) => {
//   try {
//     const city = await City.findById(req.params.id);
//     res.status(200).json(city);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//DELETE
router.delete("/:id/delete", async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.status(200).json("City has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE ONE PICTURE
router.delete("/:id/picture/delete", async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json("City not found");
    }
    const pictureIndex = city.locationPictures.findIndex(
      (picture) => picture === req.body.locationPictures
    );
    if (pictureIndex === -1) {
      return res.status(404).json(city.locationPictures);
    }
    city.locationPictures.splice(pictureIndex, 1);
    await city.save();
    res.status(200).json("Picture has been deleted...");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});



//GET ALL COUNTRIES
router.get("/allCities", async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
