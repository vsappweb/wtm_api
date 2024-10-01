const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const dotenv = require("dotenv");

//register
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      language: req.body.language,
    });
    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  try {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((status) => {
        if (status) {
          console.log("login success");
          res.status(200).json(user);
        } else {
          console.log("Wrong password!!! Try again!");
          return res.status(400).json("login failed");
        }
      });
    } else {
      console.log("User not found!!! Try again!");
      res.status(404).json("login failed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
