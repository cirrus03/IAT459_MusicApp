import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.js";
import "./App.css";
import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user
import Comments from "./Comments";

function SongDetails({ song, deleteSong, onBack }) {
  const [lyrics, setLyrics] = useState(null); // null = not fetched yet
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        console.log(song.artist);
        console.log(song.title);

        const res = await fetch(
          `http://localhost:5001/api/lyrics?artist=${encodeURIComponent(song.artist)}&title=${encodeURIComponent(song.title)}`,
        );

        //check if response is 404 (no lyrics found)
        if (!res.ok) {
          setLyrics(null);
          return;
        }

        const data = await res.json();
        if (data?.lyrics && data.lyrics.trim() !== "") {
          setLyrics(data.lyrics);
        } else {
          setLyrics(null);
        }
      } catch (err) {
        console.error("Error fetching lyrics test:", err);
        console.error(err);
        setLyrics(null);
      } finally {
        setIsLoadingLyrics(false);
      }
    };

    fetchLyrics();
  }, [song?.artist, song?.title]);

  const displayLyrics = lyrics || song.lyrics || null;

  return (
    <div className="card song-detail-card">
      <h2>Song Details</h2>

      {song.imgUrl ? (
        <img className="song-detail-image" src={song.imgUrl} alt={song.title} />
      ) : (
        <div className="placeholder">No Cover</div>
      )}

      <table className="song-detail-table">
        <tbody>
          <tr>
            <th>Title</th>
            <td>{song.title || "N/A"}</td>
          </tr>
          <tr>
            <th>Artist</th>
            <td>{song.artist || "N/A"}</td>
          </tr>
          <tr>
            <th>Album</th>
            <td>{song.album || "N/A"}</td>
          </tr>
          <tr>
            <th>Release</th>
            <td>{song.releaseDate || "N/A"}</td>
          </tr>
          <tr>
            <th>Language</th>
            <td>{song.language || "N/A"}</td>
          </tr>
          <tr>
            <th>Genre</th>
            <td>{song.genre || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <div className="lyrics-section">
        <h3>Lyrics</h3>

        {isLoadingLyrics ? (
          <p>searching for lyrics...</p>
        ) : displayLyrics ? (
          <p className="lyrics-text">{displayLyrics}</p>
        ) : (
          <p className="no-lyrics">No lyrics found</p>
        )}
      </div>

      <div className="detail-actions">
        <button
          className="secondary-btn-delete"
          onClick={() => deleteSong(song._id)}
        >
          Delete Song
        </button>
        <button className="profile-link-btn" onClick={onBack}>
          ⬅ Back to Home
        </button>
      </div>

      <Comments songId={song._id} />
    </div>
  );
}

export default SongDetails;
