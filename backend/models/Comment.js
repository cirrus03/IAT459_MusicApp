
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },
    // song: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Song",
    //     required: true,
    // },
    body: {
        type: String,
        required: true,
    }

});

module.exports = mongoose.model("Comment", CommentSchema);