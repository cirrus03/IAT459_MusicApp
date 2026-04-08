require("dotenv").config({ path: "./.env" });
const express = require("express");
const router = express.Router();

const BASE_URL = "https://customer.api.soundcharts.com";

const headers = {
"x-app-id": "MLAST-NAME1111-API_AF121AB2",
"x-api-key": "3104d976743cfaa8",
};


function getLanguageLabel(code) {
  const map = {
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
    it: "Italian",
    de: "German",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    hi: "Hindi",
    ru: "Russian",
  };

  return map[code] || code || "Unknown";
}

function getReleaseYear(releaseDate) {
  if (!releaseDate) return "Unknown";

  const year = new Date(releaseDate).getFullYear();
  return Number.isNaN(year) ? "Unknown" : String(year);
}

function getGenreLabel(genres) {
  if (!Array.isArray(genres) || genres.length === 0) {
    return "Unknown";
  }

  const firstGenre = genres[0];

  if (typeof firstGenre === "string") {
    return firstGenre;
  }

  if (firstGenre?.sub && Array.isArray(firstGenre.sub) && firstGenre.sub.length > 0) {
    return firstGenre.sub[0];
  }

  if (firstGenre?.root) {
    return firstGenre.root;
  }

  if (firstGenre?.name) {
    return firstGenre.name;
  }

  return "Unknown";
}

async function fetchSoundcharts(url) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    let errorMessage = `Soundcharts request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage =
        errorData?.errors?.[0]?.message ||
        errorData?.error?.message ||
        errorMessage;
    } catch (err) {
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch (e) {
        // ignore
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

router.get("/chart", async (req, res) => {
  console.log("entered api/soundchart/chart");

  try {
    // 1) get latest chart entries
    const chartData = await fetchSoundcharts(
      `${BASE_URL}/api/v2.14/chart/song/airplay-daily/ranking/latest?offset=0&limit=10`
    );

    const songsList = chartData.items || [];

    // 2) enrich each song with metadata + album info
    const enrichedSongs = await Promise.all(
      songsList.map(async (entry) => {
        const chartSong = entry.song || {};
        const uuid = chartSong.uuid;

        if (!uuid) {
          return {
            ...chartSong,
            albumName: "Unknown",
            releaseYear: "Unknown",
            language: "Unknown",
            genre: "Unknown",
          };
        }

        const [metadataResponse, albumsResponse] = await Promise.all([
          fetchSoundcharts(`${BASE_URL}/api/v2.25/song/${uuid}`),
          fetchSoundcharts(`${BASE_URL}/api/v2/song/${uuid}/albums?offset=0&limit=20`),
        ]);

        const metadata = metadataResponse.object || {};
        const albums = albumsResponse.items || [];

        const defaultAlbum =
          albums.find((album) => album.default === true) || albums[0] || null;

        return {
          ...chartSong,

          // keep consistent fields for frontend
          songName: chartSong.name || metadata.name || "Unknown",
          artistName:
            chartSong.artist?.name ||
            metadata.artist?.name ||
            chartSong.creditName ||
            "Unknown",

          albumName: defaultAlbum?.name || "Unknown",
          releaseYear: getReleaseYear(metadata.releaseDate),
          language: getLanguageLabel(metadata.languageCode),
          genre: getGenreLabel(metadata.genres),

          // optional extras if useful in details page
          releaseDate: metadata.releaseDate || null,
          albumUuid: defaultAlbum?.uuid || null,
          albumType: defaultAlbum?.type || null,
        };
      })
    );

    res.json(enrichedSongs);
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;