
const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Unknown Song",
  },
  artist: {
    type: String,
  },
  album: {
    type: String,
  },
  releaseDate: {
    type: String,
  },
  language: {
    type: String,
  },
  genre: {
    type: String,
  },
  lyrics: {
    type: String,
  },
});
module.exports = mongoose.model("Song", SongSchema);
