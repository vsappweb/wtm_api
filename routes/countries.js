const router = require("express").Router();
const Country = require("../models/Country");

//CREATE 
router.post("/", async (req, res) => {
  const newCountry = new Country(req.body);
  try {
    const savedCountry = await newCountry.save();
    res.status(200).json(savedCountry);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id/update", async (req, res) => {
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } //returns updated country
    );
    res.status(200).json(updatedCountry);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET
// router.get("/:id", async (req, res) => {
//   try {
//     const country = await Country.findById(req.params.id);
//     res.status(200).json(country);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//DELETE
router.delete("/:id/delete", async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    res.status(200).json("Country has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE ONE PICTURE
router.delete("/:id/picture/delete", async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json("Country not found");
    }
    const pictureIndex = country.locationPictures.findIndex(
      (picture) => picture === req.body.locationPictures
    );
    if (pictureIndex === -1) {
      return res.status(404).json(country.locationPictures);
    }
    country.locationPictures.splice(pictureIndex, 1);
    await country.save();
    res.status(200).json("Picture has been deleted...");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});



//GET ALL COUNTRIES
router.get("/allCountries", async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
