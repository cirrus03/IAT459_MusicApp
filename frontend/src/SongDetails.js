import React, { useEffect, useState, useContext } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import Comments from "./Comments";

function SongDetails({ song, deleteSong, onBack }) {
  const { user } = useContext(AuthContext);

  const [lyrics, setLyrics] = useState(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);

  // normalize song fields so both user-submitted songs
  // and Soundcharts songs work in the same component
  const title = song?.title || song?.songName || "N/A";
  const artist = song?.artist || song?.artistName || "N/A";
  const album = song?.album || song?.albumName || "N/A";
  const release = song?.releaseDate || song?.releaseYear || "N/A";
  const language = song?.language || "N/A";
  const genre = song?.genre || "N/A";
  const image = song?.imgUrl || song?.imageUrl || "N/A";

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!artist || !title || artist === "N/A" || title === "N/A") {
        setLyrics(null);
        return;
      }

      setIsLoadingLyrics(true);

      try {
        const res = await fetch(
          `http://localhost:5001/api/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`
        );

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
        console.error("Error fetching lyrics:", err);
        setLyrics(null);
      } finally {
        setIsLoadingLyrics(false);
      }
    };

    fetchLyrics();
  }, [artist, title]);

  const displayLyrics = lyrics || song?.lyrics || null;

  const isOwner = user && String(song?.createdBy) === String(user?.id);
  const isAdmin = user?.role === "admin";

  return (
    <div className="card song-detail-card">
      <h2>Song Details</h2>

      {image && image !== "N/A" ? (
        <img className="song-detail-image" src={image} alt={title} />
      ) : (
        <div className="placeholder">No Cover</div>
      )}

      <table className="song-detail-table">
        <tbody>
          <tr>
            <th>Title</th>
            <td>{title}</td>
          </tr>
          <tr>
            <th>Artist</th>
            <td>{artist}</td>
          </tr>
          <tr>
            <th>Album</th>
            <td>{album}</td>
          </tr>
          <tr>
            <th>Release</th>
            <td>{release}</td>
          </tr>
          <tr>
            <th>Language</th>
            <td>{language}</td>
          </tr>
          <tr>
            <th>Genre</th>
            <td>{genre}</td>
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
        {(isOwner || isAdmin) && song?._id && (
          <button
            className="secondary-btn-delete"
            onClick={() => deleteSong(song._id)}
          >
            Delete Song
          </button>
        )}

        <button className="profile-link-btn" onClick={onBack}>
          ⬅ Back to Home
        </button>
      </div>

      {song?._id && <Comments songId={song._id} />}
    </div>
  );
}

export default SongDetails;