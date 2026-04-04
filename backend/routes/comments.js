const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth"); //import middleware to add auth headers to our routes


//GET ROUTE retrieve all commments
router.get("/:songId", async (req, res) => {
  try {
    // const comments = await Comment.find( {song: req.songId} ) ; //find all the comments that reference speficied song
    const comments = await Comment.find({ song: req.params.songId })
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST ROUTE create a comment
router.post("/", auth, async (req, res) => { 
    const comment = new Comment({
        author: req.user.id,
        // song: req.songId,
        body: req.body.textBody, 
    });


    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


//DELETE ROUTE delete a comment (if you are the op)
//add body here

//EDIT ROUTE edit teh content of a comment (if you are the op)

module.exports = router;

