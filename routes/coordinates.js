const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Group = require("../models/Group");
const EventEmitter = require("events");
const emitter = new EventEmitter();

// Оновлення координат користувача
router.patch("/latlong/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, latitude, longitude } = req.body;

    // Перевірка, чи передані координати
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Оновлення координат користувача
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { latitude, longitude } },
      { new: true } // Повернути оновлений документ
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Викидання події оновлення
    emitter.emit("updateUser", {
      userId: updatedUser._id,
      latitude: updatedUser.latitude,
      longitude: updatedUser.longitude,
    });

    res.status(200).json({ message: "Coordinates updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Зчитування координат учасників групи через long-polling
router.get("/latlong/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    // Пошук групи
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Отримання учасників групи одним запитом
    const users = await User.find({ _id: { $in: group.membersOfGroup } }).select(
      "_id username profilePicture role latitude longitude"
    );

    if (!users.length) {
      return res.status(404).json({ message: "No users found in group" });
    }

    // Відправлення початкових даних
    // res.status(200).json({ message: "Initial data", users });
    res.status(200).json(users);

    // Обробка оновлень через long-polling
    emitter.once("updateUser", (updatedUser) => {
      const userToUpdate = users.find((user) => user._id.toString() === updatedUser._id.toString());
      if (userToUpdate) {
        userToUpdate.latitude = updatedUser.latitude;
        userToUpdate.longitude = updatedUser.longitude;
        // res.status(200).json({ message: "User updated", user: userToUpdate });
        res.status(200).json({user: userToUpdate});
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
