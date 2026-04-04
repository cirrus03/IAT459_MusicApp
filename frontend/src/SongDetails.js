import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.js";
import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user
import Comments from "./Comments";

function SongDetails ({song, deleteSong, onBack}) {

    return(
        <div className="card song-detail-card">
              <h2>Song Details</h2>

              {song.imgUrl ? (
                <img src={song.imgUrl} alt={song.title} />
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
                {song.lyrics ? (
                  <p className="lyrics-text">{song.lyrics}</p>
                ) : (
                  <p className="no-lyrics">No lyrics available</p>
                )}
              </div>

              <div className="detail-actions">
                <button
                  className="secondary-btn-delete"
                  onClick={() => deleteSong(song._id)}
                >
                  Delete Song
                </button>
                <button
                  className="secondary-btn"
                  onClick={onBack}
                >
                  ⬅ Back to Home
                </button>
              </div>

              <Comments songId={song._id}/>
            </div>
    );
}

export default SongDetails;