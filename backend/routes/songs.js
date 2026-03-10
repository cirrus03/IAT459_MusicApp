const express = require("express");
const router = express.Router();
const Song = require("../models/Song");
const verifyToken = require("../middleware/auth"); //import middleware to add auth headers to our routes

// GET ROUTE
router.get("/", async (req, res) => {
  try {
    const plants = await Song.find(); //removed song limit
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ROUTE for SEARCH (search songs by title, artist, or album)
router.get("/search", async (req, res) => {
  try {
    // query parameters
    const { title, artist, album } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    } // regular expression and case insensitive search

    if (artist) {
      query.artist = { $regex: artist, $options: "i" };
    }

    if (album) {
      query.album = { $regex: album, $options: "i" };
    }

    // find songs matching the search
    const songs = await Song.find(query);

    // return filtered songs
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Error searching songs" });
  }
});

// POST ROUTE (create song)
router.post("/", verifyToken, async (req, res) => {
  const song = new Song({
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    releaseDate: req.body.releaseDate,
    language: req.body.language,
    genre: req.body.genre,
    lyrics: req.body.lyrics,
  });

  try {
    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE ROUTE
router.delete("/:id", async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
