
require("dotenv").config( { path: './.env' } );
const express = require("express");
const router = express.Router();

const playlistID = PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx;

//youtube api key
// AIzaSyBEBgEcLutsfhv07UCKvFmnqYFAok4c7cs

//fech yt api key function
const getAPIKey = () => {
    const key = process.env.YT_API_KEY;
    console.log(key);
    return key;
}

router.get("/playlist", async (req, res) => {
    try {

    } catch(err) {

    }
});

