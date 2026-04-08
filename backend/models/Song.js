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
  imgUrl: {
    type: String,
  },

  //for soundchart's generated songs id
  externalId: {
    type: String,
    sparse: true, //apparently should only apply uniquness when this actually exists.... i think.
    unique: true
  },

  //is it user created  or from sound chart
  source: {
    type: String,
    enum: ["user", "soundcharts"],
    default: "soundcharts"
  },

  // store which user created this song
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Song", SongSchema);