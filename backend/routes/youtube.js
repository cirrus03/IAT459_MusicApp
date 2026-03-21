
require("dotenv").config( { path: './.env' } );
const express = require("express");
const router = express.Router();

const playlistID = "PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx";

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
        const playlistResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistID}&key=${getAPIKey()}`);

        if (!playlistResponse.ok) {
            console.log("!Playlist reponse.ok");
        // throw new Error(playlistData.error?.message || "Playlist fetch failed");\
            throw new Error(
                playlistData.error_description ||
                playlistData.error?.message ||
                "Unknown yt error"
            );
        }
        const playlistData = await playlistResponse.json();

        console.log(playlistData);
        console.log("made it to end of block?");
        res.json(playlistData);

    } catch(err) {
         console.error("ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;
