const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const verifyToken = require("../middleware/auth"); //import middleware to add auth headers to our routes


//GET ROUTE retrieve all commments
router.get("/:songId", async (req, res) => {
  try {
    const comments = await Comment.find( {song: req.songId} ) ; //find all the comments that reference speficied song
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST ROUTE create a comment
router.post("/", verifyToken, async (req, res) => {
    const comment = new Comment({
        author: req.userId,
        song: req.songId,
        body: req.textBody, 
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


