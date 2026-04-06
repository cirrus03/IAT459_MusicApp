const express = require("express");
const router = express.Router();
const Song = require("../models/Song");
const verifyToken = require("../middleware/auth"); // import middleware to protect routes

// GET ROUTE
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ROUTE for SEARCH (search songs by title, artist, or album)
router.get("/search", async (req, res) => {
  try {
    const { title, artist, album } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (artist) {
      query.artist = { $regex: artist, $options: "i" };
    }

    if (album) {
      query.album = { $regex: album, $options: "i" };
    }

    const songs = await Song.find(query);
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

    // save which logged-in user created the song
    createdBy: req.user.id,
  });

  try {
    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//POST ROUTE (specfically for when a top10 soundchart recc is clicked to create/find an existing db entry or whatever kill me now)
router.post("/song-from-soundcharts", async (req, res) => {
  console.log("i am inside the song-from-soundcharts route post")
  console.log("uuid: ", req.body.uuid);
  console.log("title: ", req.body.title);
  console.log("artist: ", req.body.artist);
  console.log("uuid: ", req.body.imgUrl);

  try {
    console.log("inside try block db update");
    const song = await Song.findOneAndUpdate(
      {externalId: req.body.uuid},
      {
        $set: {
          title: req.body.title,
          artist: req.body.artist,
          imageUrl: req.body.imgUrl,
        }
      },
      {
        new: true, //apparently will return the updated doc instead of old one if it finds it
        upsert: true, //..probably makes the new doc if it can find it from what i understand
      }
    );

    console.log("this is the song: ", song);
    res.json(song);

  } catch(error) {
    res.status(500).json( {message: error.message} );
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