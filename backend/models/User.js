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
});

module.exports = mongoose.model("User", userSchema);