
const mongoose = require("mongoose");

const commentSchema = new mongoose.schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        required: true,
    },
    body: {
        type: String,
        required: true,
    }

});

