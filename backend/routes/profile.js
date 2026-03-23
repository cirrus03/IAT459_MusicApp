const express = require("express");
const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/auth");

// GET current user's profile + favorites
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("favorites"); // populate full song objects

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD a song to favorites
router.post("/favorite/:songId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // prevent duplicates
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

    res.json({ message: "Song removed from favorites", favorites: user.favorites });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;