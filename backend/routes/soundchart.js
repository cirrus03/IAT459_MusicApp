require("dotenv").config({ path: "./.env" });
const express = require("express");
const router = express.Router();

router.get("/chart", async (req, res) => {
  try {
    // console.log("inside the function");
    // const chartResponse = await fetch(
    //   "https://customer.api.soundcharts.com/api/v2/chart/song/by-platform/spotify?offset=0&limit=10",
    //   {
    //     headers: {
    //       "x-app-id": "SCHANG6-API_41F9DF25",
    //       "x-api-key": "5db998d43b8358a4",
    //     },
    //   },
    // );


    //global 28 for spotify daily i think
    //airplay-daily for radio..?\
    //we can also get albums from the 
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

    console.log(chartData);
    console.log("made it to end of block?");
    res.json(chartData);

  } catch (err) {
    console.error("ERROR:", err.message);
    console.log("something went wrong");
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
