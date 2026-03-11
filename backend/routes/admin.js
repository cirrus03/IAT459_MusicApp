const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const verifyAdmin = require("../middleware/verifyAdmin");

// GET all users
// only admins should be able to view the member list
router.get("/users", auth, verifyAdmin, async (req, res) => {
    try {
    const users = await User.find().select("-password");
    res.json(users);
    } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;