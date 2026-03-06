
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Save the user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Find User
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // 3. Generate Token
    const token = jwt.sign({ 
      id: user._id,
      username: user.username, }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: {id: user._id, username: user.username} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;