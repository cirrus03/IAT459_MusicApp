import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function Profile() {
  // get current logged-in user and token from AuthContext
  const { token, logout } = useContext(AuthContext);

  // store full profile data from backend
  const [profile, setProfile] = useState(null);

  // loading state for cleaner rendering
  const [loading, setLoading] = useState(true);

  // selected song for detail view
  const [selectedSong, setSelectedSong] = useState(null);

  // fetch the logged-in user's profile and favorites
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5001/api/profile", {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("PROFILE RESPONSE:", data);
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  // remove a song from favorites
  const handleUnfavorite = async (songId) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/profile/favorite/${songId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove favorite");
      }

      // update profile state immediately so UI refreshes without reloading
      setProfile((prevProfile) => ({
        ...prevProfile,
        favorites: prevProfile.favorites.filter((song) => song._id !== songId),
      }));

      // if the removed song is currently selected, return to grid view
      if (selectedSong?._id === songId) {
        setSelectedSong(null);
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  return (
    <div className="page-container">
      {/* top bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-user">
          <p className="dashboard-eyebrow">Music Map</p>
          <h2 className="dashboard-greeting">Your Profile</h2>
          <p className="dashboard-subtext">
            View your account details and your favorited songs.
          </p>
        </div>

        <div className="profile-top-actions">
          <Link to="/" className="profile-link-btn">
            Home
          </Link>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* profile info */}
      <div className="card profile-card">
        <h3>Personal Info</h3>

        {loading ? (
          <p className="profile-empty">Loading profile...</p>
        ) : profile?.error ? (
          <p className="profile-empty">{profile.error}</p>
        ) : profile ? (
          <div className="profile-info">
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p>
          </div>
        ) : (
          <p className="profile-empty">No profile data found.</p>
        )}
      </div>

      {/* favorites section */}
      <div className="profile-favorites-section">
        <div className="section-heading">
          <h3>Favorited Songs</h3>
          <p>{profile?.favorites?.length || 0} song(s)</p>
        </div>

        {loading ? (
          <div className="card">
            <p className="profile-empty">Loading favorites...</p>
          </div>
        ) : profile?.error ? (
          <div className="card">
            <p className="profile-empty">{profile.error}</p>
          </div>
        ) : !profile?.favorites || profile.favorites.length === 0 ? (
          <div className="card">
            <p className="profile-empty">
              You haven’t favorited any songs yet.
            </p>
          </div>
        ) : selectedSong ? (
          // detail view
          <div className="card song-detail-card">
            <h2>Song Details</h2>

            {selectedSong.imgUrl ? (
              <img src={selectedSong.imgUrl} alt={selectedSong.title} />
            ) : (
              <div className="placeholder">No Cover</div>
            )}

            <table className="song-detail-table">
              <tbody>
                <tr>
                  <th>Title</th>
                  <td>{selectedSong.title || "N/A"}</td>
                </tr>
                <tr>
                  <th>Artist</th>
                  <td>{selectedSong.artist || "N/A"}</td>
                </tr>
                <tr>
                  <th>Album</th>
                  <td>{selectedSong.album || "N/A"}</td>
                </tr>
                <tr>
                  <th>Release</th>
                  <td>{selectedSong.releaseDate || "N/A"}</td>
                </tr>
                <tr>
                  <th>Language</th>
                  <td>{selectedSong.language || "N/A"}</td>
                </tr>
                <tr>
                  <th>Genre</th>
                  <td>{selectedSong.genre || "N/A"}</td>
                </tr>
              </tbody>
            </table>

            <div className="lyrics-section">
              <h3>Lyrics</h3>
              {selectedSong.lyrics ? (
                <p className="lyrics-text">{selectedSong.lyrics}</p>
              ) : (
                <p className="no-lyrics">No lyrics available</p>
              )}
            </div>

            <div className="detail-actions">
              <button
                className="secondary-btn-delete"
                onClick={() => handleUnfavorite(selectedSong._id)}
              >
                Remove from Favorites
              </button>
              <button
                className="secondary-btn"
                onClick={() => setSelectedSong(null)}
              >
                ⬅ Back to Favorites
              </button>
            </div>
          </div>
        ) : (
          // favorites grid
          <div className="song-grid">
            {profile.favorites.map((song) => (
              <div
                key={song._id}
                className="song-card"
                onClick={() => setSelectedSong(song)}
              >
                <div className="image-container">
                  {song.imgUrl ? (
                    <img src={song.imgUrl} alt={song.title} />
                  ) : (
                    <div className="placeholder">No Cover</div>
                  )}
                </div>

                <div className="card-details">
                  <h3>{song.title}</h3>
                  <p>
                    <strong>Artist:</strong> {song.artist || "N/A"}
                  </p>
                  <p>
                    <strong>Album:</strong> {song.album || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong> {song.releaseDate || "N/A"}
                  </p>
                  <p>
                    <strong>Genre:</strong> {song.genre || "N/A"}
                  </p>

                  <button
                    className="unfavorite-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnfavorite(song._id);
                    }}
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;