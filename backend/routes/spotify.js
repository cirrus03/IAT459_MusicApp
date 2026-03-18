


require("dotenv").config( { path: './.env' } );

const express = require("express");
const router = express.Router();


const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};


// router.post("/auth", async (req, res, err) => {
//     try {
//         console.log("inside the try block");
//         const response = await fetch(authOptions.url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': "application/json",
//             'Authorization': "Basic" + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
//           },
//           body: new URLSearchParams( {
//             grant_type: "client_credentials"
//           })
//         });

//         const data = await response.json();
//         res.json(data);
//         console.log(data);

//         if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);

//         res.json(data);
//         console.log(data);
//     }

//     } catch (err) {
//     console.error("ERROR:", err.message);
//     res.status(400).json({ message: err.message });
//   }
// });

router.post("/auth", async (req, res) => {
  try {

    console.log(client_id);
    console.log(client_secret);
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials"
      })
    });

    const data = await response.json();
    console.log("SPOTIFY RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data.error_description || data.error);
    }

    res.json(data);

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;

