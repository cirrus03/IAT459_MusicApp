import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function General() {
  const { logout, token } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);

  // states for searching and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    genre: [],
    language: [],
    releaseYear: [],
  });

  // fetch public song list
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/songs");
        const data = await res.json();
        setSongs(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };

    fetchSongs();
  }, []);

  // handles searching
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // handles filter changes
  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (checked) {
        if (!newFilters[name].includes(value)) {
          newFilters[name].push(value);
        }
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }

      return newFilters;
    });
  };

  // filter songs based on search + selected filters
  const filteredSongs = songs.filter((song) => {
    const searchMatch =
      song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album?.toLowerCase().includes(searchQuery.toLowerCase());

    const genreMatch =
      filters.genre.length === 0 || filters.genre.includes(song.genre);

    const languageMatch =
      filters.language.length === 0 || filters.language.includes(song.language);

    const yearMatch =
      filters.releaseYear.length === 0 ||
      filters.releaseYear.includes(song.releaseDate);

    return searchMatch && genreMatch && languageMatch && yearMatch;
  });

  return (
    <div className="page-container">
      {/* top bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-user">
          <p className="dashboard-eyebrow">Music Map</p>
          <h2 className="dashboard-greeting">Explore Music Publicly</h2>
          <p className="dashboard-subtext">
            Browse user-submitted songs as a visitor. Create an account to
            favorite tracks, add your own songs, and access your profile.
          </p>
        </div>

        <div className="profile-top-actions">
          {token ? (
            <>
              <Link to="/" className="profile-link-btn">
                Dashboard
              </Link>
              <button className="logout-btn" onClick={logout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="profile-link-btn">
                Login
              </Link>
              <Link to="/register" className="logout-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* visitor notice */}
      <div className="card visitor-card">
        <h3>Visitor Access</h3>
        <p className="form-description">
          Make an account to favorite
          tracks, add songs, comment, or manage content!
        </p>
      </div>

      {/* filters + collection */}
      <div className="right-panel">
        <div className="filters">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title, artist, or album"
            className="search-bar"
          />

          <div className="filter-group">
            <h4>Genre</h4>

            <label>
              <input
                type="checkbox"
                name="genre"
                value="Pop"
                onChange={handleFilterChange}
              />
              Pop
            </label>

            <label>
              <input
                type="checkbox"
                name="genre"
                value="Rock"
                onChange={handleFilterChange}
              />
              Rock
            </label>

            <label>
              <input
                type="checkbox"
                name="genre"
                value="Hip-Hop"
                onChange={handleFilterChange}
              />
              Hip-Hop
            </label>
          </div>

          <div className="filter-group">
            <h4>Language</h4>

            <label>
              <input
                type="checkbox"
                name="language"
                value="English"
                onChange={handleFilterChange}
              />
              English
            </label>

            <label>
              <input
                type="checkbox"
                name="language"
                value="French"
                onChange={handleFilterChange}
              />
              French
            </label>

            <label>
              <input
                type="checkbox"
                name="language"
                value="Spanish"
                onChange={handleFilterChange}
              />
              Spanish
            </label>
          </div>

          <div className="filter-group">
            <h4>Release Year</h4>

            <label>
              <input
                type="checkbox"
                name="releaseYear"
                value="2024"
                onChange={handleFilterChange}
              />
              2024
            </label>

            <label>
              <input
                type="checkbox"
                name="releaseYear"
                value="2023"
                onChange={handleFilterChange}
              />
              2023
            </label>
          </div>
        </div>

        <div className="section-heading">
          <h3>Public Song Collection</h3>
          <p>{filteredSongs.length} song(s)</p>
        </div>

        <div className="song-grid">
          {filteredSongs.map((song) => (
            <div key={song._id} className="song-card general-song-card">
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
              </div>

              <div className="visitor-locked-actions">
                <p className="visitor-locked-text">
                  Login to favorite, comment, or manage this song.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default General;