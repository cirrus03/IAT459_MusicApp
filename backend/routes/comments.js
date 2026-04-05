const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth"); //import middleware to add auth headers to our routes


//GET ROUTE retrieve all commments
router.get("/:songId", async (req, res) => {
  try {
    // const comments = await Comment.find( {song: req.songId} ) ; //find all the comments that reference speficied song
    const comments = await Comment.find({ song: req.params.songId })
    .populate("author", "username _id");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST ROUTE create a comment
router.post("/", auth, async (req, res) => { 
    const comment = new Comment({
        author: req.user.id,
        song: req.body.songId,
        body: req.body.textBody, 
    });

    console.log("comment object to be posted");
    console.log(comment);

    console.log("req.body:", req.body);
    console.log("typeof songId:", typeof req.body.songId);

    try {
        const newComment = await comment.save();

        //populate so that the author and delete fields will instantly update i think
        const populatedComment = await newComment.populate("author");


        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
        console.log(err.message);
    }
});


//DELETE ROUTE delete a comment (if you are the op)
//add body here
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if(!comment) {
      return res.status(404).json( {message: "comment not found"} );
    }

    //check ownership before deleting
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json( {message: "forbidden. cannot delete other's comments"});
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json( {message: "plant deleted"});

  } catch(error) {
      res.status(500).json( {message: "server error"} );
  }
});


//DELETE ROUTE for deleting all songs? will do this later if time permits

//EDIT ROUTE edit teh content of a comment (if you are the op)

module.exports = router;

