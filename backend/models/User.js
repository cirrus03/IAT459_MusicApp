
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // role determines what level of access the user has
  // normal users will be "member" by default
  // admin users will be manually changed to "admin" in MongoDB
  role: {
    type: String,
    enum: ["member", "admin"],
    default: "member",
  },

  // store the user's favorited songs
  // each entry references a Song document by its MongoDB ObjectId
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);