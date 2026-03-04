
const express = require("express");
const router = express.Router();
const Song = require("../models/Song");
const verifyToken = require("../middleware/auth"); //import middleware to add auth headers to our routes

// GET ROUTE (fetch first 3)
router.get("/", async (req, res) => {
    try {
        const plants = await Song.find().limit(3); //limit to first three i guess
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST ROUTE (create Plant)
router.post("/", verifyToken, async (req, res) => {
    const song = new Song({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        releaseDate: req.body.releaseDate,
        language: req.body.language,
        genre: req.body.genre,
        lyrics: req.body.lyrics
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