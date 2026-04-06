import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function SongForm() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // store the form inputs.
  // we use a single object to hold all fields instead of creating 6 separate state variables.
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    releaseDate: "",
    language: "",
    genre: "",
    lyrics: "",
  });

  //event handles for typing in forms
  // we use [e.target.name] as a dynamic key to update the correct field in the object
  const handleChange = (e) => {
    setFormData({
      ...formData, // spread operator: keep existing data (don't delete other fields) (immutability)
      [e.target.name]: e.target.value, // overwrite only the field currently being typed in
    });
  };

  // handles the "Add Song" button click.
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser from reloading the page (standard form behavior)
    try {
      // send the new data to the Backend
      const response = await fetch("http://localhost:5001/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // attach the token to prove user is authorized
          Authorization: token,
        },
        body: JSON.stringify(formData), // Convert JS object to JSON string
      });

      if (response.ok) {
        // redirect to dashboard after adding song
        navigate("/");
      } else {
        alert("Failed to add song.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-topbar">
        <div className="dashboard-user">
          <p className="dashboard-eyebrow">Music Map</p>
          <h2 className="dashboard-greeting">Add a New Song</h2>
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

      <div className="content-wrapper">
        <div className="card left-panel">
          <h3>Song Details</h3>
          <p className="form-description">
            Enter song details to add a new track to the collection.
          </p>

          <form onSubmit={handleSubmit} className="song-form">
            <label>Name</label>

            {/* Note on Inputs:
                - 'name' attribute must match the state key (e.g. "commonName")
                - 'value' binds the input to the state (Controlled Component)
                - 'onChange' updates the state when typing
                */}
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter song title"
              required
            />

            <label>Artist</label>
            <input
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              placeholder="Enter artist name"
            />

            <label>Album</label>
            <input
              name="album"
              value={formData.album}
              onChange={handleChange}
              placeholder="Enter album name"
            />

            <label>Release Date</label>
            <input
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              placeholder="e.g. 2024"
            />

            <label>Language</label>
            <input
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Enter language"
            />

            <label>Genre</label>
            <input
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Enter genre"
            />

            <label>Lyrics</label>
            <input
              name="lyrics"
              value={formData.lyrics}
              onChange={handleChange}
              placeholder="Optional lyric snippet"
            />

            <div className="form-actions-row">
              <button className="primary-btn" type="submit">
                Save Song
              </button>
              <Link to="/" className="profile-link-btn">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SongForm;
