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

// DELETE a user account
router.delete("/users/:id", verifyAdmin, async (req, res) => {
    try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
    } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;