const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Song = require("../models/Song");
const auth = require("../middleware/auth");

// GET current user's profile + favorites + submitted songs
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("favorites");

    const userSongs = await Song.find({ createdBy: req.user.id });

    res.json({
      ...user.toObject(),
      songs: userSongs,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE username
router.put("/username", auth, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: "Username is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username: username.trim() },
      { new: true }
    )
      .select("-password")
      .populate("favorites");

    const userSongs = await Song.find({ createdBy: req.user.id });

    res.json({
      ...updatedUser.toObject(),
      songs: userSongs,
    });
  } catch (err) {
    console.error("Error updating username:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD a song to favorites
router.post("/favorite/:songId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(req.params.songId)) {
      user.favorites.push(req.params.songId);
      await user.save();
    }

    res.json({ message: "Song added to favorites", favorites: user.favorites });
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// REMOVE a song from favorites
router.delete("/favorite/:songId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.songId
    );

    await user.save();

    res.json({
      message: "Song removed from favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;