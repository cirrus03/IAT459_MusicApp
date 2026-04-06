require("dotenv").config({ path: "./.env" });
const express = require("express");
const router = express.Router();

router.get("/chart", async (req, res) => {
  console.log("entered api/soundchart/chart");
  try {
    const chartResponse = await fetch(
      "https://customer.api.soundcharts.com/api/v2.14/chart/song/airplay-daily/ranking/latest?offset=0&limit=100",
      {
        headers: {
          "x-app-id": "SCHANG6-API_41F9DF25",
          "x-api-key": "5db998d43b8358a4", 
        },
      },
    );

    if (!chartResponse.ok) {
      console.log("!Playlist reponse.ok");
      throw new Error(
        chartResponse.error_description ||
          chartResponse.error?.message ||
          "Unknown chart error",
      );
    }

    const chartData = await chartResponse.json();
    const songsList = chartData.items.slice(0, 10); //get array of 10 songs only sorry guys
    const arraySongsList = songsList.map((song) => (song.song));

    console.log(arraySongsList);
    console.log("made it to end of block?");
    res.json(arraySongsList);

  } catch (err) {
    console.error("ERROR:", err.message);
    console.log("something went wrong");
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
