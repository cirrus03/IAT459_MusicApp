const express = require("express");
const router = express.Router();
const axios = require("axios");

const artist = "Sabrina Carpenter";
const title = "Espresso";

router.get("/", async (req, res) => {
  try {
    console.log("lyrics route is working");

    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    );

    res.json(response.data);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ message: err.message });
  }
});

router.get("/test", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.lyrics.ovh/v1/Coldplay/Yellow"
    );

    res.json(response.data);

  } catch (err) {
    res.status(400).json(err.response?.data || err.message);
  }
});

module.exports = router;