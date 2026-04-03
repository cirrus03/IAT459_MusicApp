import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function Profile() {
  const { token, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedSection, setSelectedSection] = useState("favorites");
  const [newUsername, setNewUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5001/api/profile", {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
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

      setProfile((prevProfile) => ({
        ...prevProfile,
        favorites: prevProfile.favorites.filter((song) => song._id !== songId),
      }));

      if (selectedSong?._id === songId) {
        setSelectedSong(null);
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const handleUpdateUsername = async () => {
    try {
      setUsernameMessage("");

      const res = await fetch("http://localhost:5001/api/profile/username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        setUsernameMessage(data.error || "Could not update username");
        return;
      }

      setProfile(data);
      setNewUsername("");
      setIsEditing(false);
      setUsernameMessage("Username updated successfully.");
    } catch (err) {
      console.error("Error updating username:", err);
      setUsernameMessage("Something went wrong.");
    }
  };

  const activeSongs =
    selectedSection === "favorites"
      ? profile?.favorites || []
      : profile?.songs || [];

  return (
    <div className="page-container">
      <div className="dashboard-topbar">
        <div className="dashboard-user">
          <p className="dashboard-eyebrow">Music Map</p>
          <h2 className="dashboard-greeting">Your Profile</h2>
          <p className="dashboard-subtext">
            View your account details, your songs, and your favorites.
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

      <div className="card profile-card">
        <h3>Personal Info</h3>

        {loading ? (
          <p className="profile-empty">Loading profile...</p>
        ) : profile?.error ? (
          <p className="profile-empty">{profile.error}</p>
        ) : profile ? (
          <div className="profile-info">
            <div className="profile-info-row">
              <strong>Username:</strong>

              {!isEditing ? (
                <span className="username-inline">
                  {profile.username}
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setNewUsername(profile.username);
                      setUsernameMessage("");
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                </span>
              ) : (
                <span className="username-editing">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />

                  <button className="save-btn" onClick={handleUpdateUsername}>
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setIsEditing(false);
                      setNewUsername("");
                      setUsernameMessage("");
                    }}
                  >
                    Cancel
                  </button>
                </span>
              )}
            </div>

            <p>
              <strong>Role:</strong> {profile.role}
            </p>

            {usernameMessage && (
              <p className="profile-message">{usernameMessage}</p>
            )}
          </div>
        ) : (
          <p className="profile-empty">No profile data found.</p>
        )}
      </div>

      <div className="profile-tabs">
        <button
          className={
            selectedSection === "favorites"
              ? "profile-tab active-tab"
              : "profile-tab"
          }
          onClick={() => {
            setSelectedSection("favorites");
            setSelectedSong(null);
          }}
        >
          Favorites
        </button>

        <button
          className={
            selectedSection === "songs"
              ? "profile-tab active-tab"
              : "profile-tab"
          }
          onClick={() => {
            setSelectedSection("songs");
            setSelectedSong(null);
          }}
        >
          Your Songs
        </button>
      </div>

      <div className="profile-favorites-section">
        <div className="section-heading">
          <h3>
            {selectedSection === "favorites"
              ? "Favorited Songs"
              : "Your Submitted Songs"}
          </h3>
          <p>{activeSongs.length} song(s)</p>
        </div>

        {loading ? (
          <div className="card">
            <p className="profile-empty">Loading songs...</p>
          </div>
        ) : profile?.error ? (
          <div className="card">
            <p className="profile-empty">{profile.error}</p>
          </div>
        ) : activeSongs.length === 0 ? (
          <div className="card">
            <p className="profile-empty">
              {selectedSection === "favorites"
                ? "You haven’t favorited any songs yet."
                : "You haven’t added any songs yet."}
            </p>
          </div>
        ) : selectedSong ? (
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
              {selectedSection === "favorites" && (
                <button
                  className="secondary-btn-delete"
                  onClick={() => handleUnfavorite(selectedSong._id)}
                >
                  Remove from Favorites
                </button>
              )}

              <button
                className="secondary-btn"
                onClick={() => setSelectedSong(null)}
              >
                ⬅ Back
              </button>
            </div>
          </div>
        ) : (
          <div className="song-grid">
            {activeSongs.map((song) => (
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

                  {selectedSection === "favorites" && (
                    <button
                      className="unfavorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnfavorite(song._id);
                      }}
                    >
                      Remove from Favorites
                    </button>
                  )}
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