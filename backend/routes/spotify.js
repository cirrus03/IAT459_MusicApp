


require("dotenv").config( { path: './.env' } );

const express = require("express");
const router = express.Router();


const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    // playlist id for global top 50: 37i9dQZEVXbMDoHDwVN2tF
    
    //playlist for copied global top 50 on my accounts because spotify restricts dev access to their own playlist apparently????????????? 7gFE1NKx1Pvasnwuum0Qdq

const global_top_50_id = "7gFE1NKx1Pvasnwuum0Qdq";

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


router.get("/playlist", async (req, res) => {
  try {

    //FETCH ACCESS TOKEN FROM SPOTIFY WITH CLIENT CRED FLOW

    // console.log(client_id); 
    // console.log(client_secret);

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials"
      })
    });

    const tokenData = await tokenResponse.json();
    console.log("SPOTIFY RESPONSE:", tokenData); //log the response to check

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description ||tokenData.error);
    }
    
    const {access_token, token_type} = tokenData; //decontrruct relevant information into local scoped variable to use later
    // const accessToken = tokenData.access_token; 
    // const accessType = tokenData.token_type;
    console.log("access token is: " + access_token); //check these values to make sure they're saved okay
    console.log("access type is: " + token_type);


    //GET PLAYLIST GLOBAL TOP 50 FROM SPOTIFY
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${global_top_50_id}`, {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });

    const playlistData = await playlistResponse.json();

    //check if playlist ok or not ok
    if (!playlistResponse.ok) {
      console.log("!Playlist reponse.ok");
      // throw new Error(playlistData.error?.message || "Playlist fetch failed");\
      throw new Error(
        playlistData.error_description ||
        playlistData.error?.message ||
        "Unknown Spotify error"
      );
    }

    //send playlist (not tracks) to frontend
    res.json(playlistData);

    //get the tracks from playlist 
    // const tracks = playlistData.items.items.map((song) => ({
    //   name: song.item.name,
      // artist: song.items.artists.map(a => a.name).join(", "),
      // album: song.items.album.name,
    // }));

  //   const tracks = playlistData.tracks.items
  // .filter(item => item.track)
  // .map(item => ({
  //   name: item.track.name,
  //   artist: item.track.artists.map(a => a.name).join(", "),
  //   album: item.track.album.name,
  //   releaseYear: item.track.album.release_date?.slice(0, 4),
  //   image: item.track.album.images[0]?.url,
  //   preview: item.track.preview_url
  // }));

    //send list of songs to frontend
    // res.json(tracks);


  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;

