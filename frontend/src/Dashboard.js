import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./App.css";

import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user

function Dashboard() {
  /////////// STATES ////////////////
  const [message, setMessage] = useState("");

  // store the list of songs fetched from the database.
  // initial value is an empty array [] because we haven't fetched data yet.
  const [songs, setSongs] = useState([]);

  // store the list of users for the admin view
  const [users, setUsers] = useState([]);

  // selected song for detail view
  const [selectedSong, setSelectedSong] = useState(null);

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

  // states for searching and filtering
  const [searchQuery, setSearchQuery] = useState(""); // search input
  const [filters, setFilters] = useState({
    genre: [],
    language: [],
    releaseYear: [],
  });

  //state for holding testing lyrics
  const [lyrics, setLyrics] = useState({
    lyrics: "",
  });

  // tap into our AuthContext
  // we grab the token, the decoded user object (for the greeting),
  // and the logout function (to attach to our button)
  const { token, user, logout } = useContext(AuthContext);

  ////// USE EFFECT rendering ///////////////////

  //fetching lyric test
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/lyrics");
        const data = await res.json();
        console.log(data);
        // setLyrics(data);
      } catch (err) {
        console.error("Error fetching lyrics test:", err);
      }
    };

    fetchLyrics();
  }, []);

  //fetching spotify playlist test
  //  useEffect(() => {
  //   const fetchSpotifyPlaylist = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5001/api/spotify/playlist", {
  //         method: "GET"
  //       });
  //       const data = await res.json();
  //       console.log(data);
  //     } catch (err) {
  //       console.error("Error fetching spotify plyalist:", err);
  //     }
  //   };

  //   fetchSpotifyPlaylist();
  // }, []);

  //fetch youtube top 50 playlist
  //  useEffect(() => {
  //   const fetchYTPlaylist = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5001/api/youtube/playlist", {
  //         method: "GET"
  //       });
  //       const data = await res.json();
  //       console.log(data);
  //     } catch (err) {
  //       console.error("Error fetching spotify plyalist:", err);
  //     }
  //   };

  //   fetchYTPlaylist();
  // }, []);

  useEffect(() => {
    const fetchSounchartChart = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/soundchart/chart", {
          method: "GET",
        });
        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error("Error fetching soundchart chart:", err);
      }
    };

    fetchSounchartChart();
  }, []);

  //fetching song list
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

  //check if frontend and backend are connected from prev lab
  useEffect(() => {
    // Note: We use the FULL URL. There is no proxy to infer the host.
    fetch("http://localhost:5001/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  //user check
  useEffect(() => {
    // Note: We use the FULL URL. There is no proxy to infer the host.
    console.log(user);
    // console.log(user.username);
  }, [user]);

  // fetch the member list only if the logged-in user is an admin
  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5001/api/admin/users", {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Admin users response:", data);

          // only save the data if it is actually an array
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error("Expected an array of users but got:", data);
            setUsers([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setUsers([]);
        });
    }
  }, [user, token]);

  /////// HANDLERS //////////

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

      // get the saved song (including the new _id from MongoDB)
      const newSong = await response.json();

      // update the UI immediately by adding the new song to the existing list
      setSongs([...songs, newSong]);

      // clear the form inputs so the user can type a new one
      setFormData({
        title: "",
        artist: "",
        album: "",
        releaseDate: "",
        language: "",
        genre: "",
        lyrics: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // handles deleting a song.
  const handleDelete = async (id) => {
    try {
      // tell Backend to delete the document with this specific ID
      const response = await fetch(`http://localhost:5001/api/songs/${id}`, {
        method: "DELETE",
        headers: {
          // attach the token to prove user is authorized
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete. Are you authorized?");
      }

      // update Frontend: Keep all songs EXCEPT the one we just deleted
      setSongs(songs.filter((song) => song._id !== id));

      // if deleting selected song --> go back to song grid
      if (selectedSong?._id === id) {
        setSelectedSong(null);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // handles searching
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // update search query
  };

  // handles filter changees
  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (checked) {
        if (newFilters[name].includes(value)) return newFilters;
        newFilters[name].push(value);
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
      return newFilters;
    });
  };

  // sort songs based on filters
  const filteredSongs = songs.filter((song) => {
    const searchMatch =
      song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album?.toLowerCase().includes(searchQuery.toLowerCase());
    // toLowerCase --> changes input to lowercase before searching

    // searches title/artist/album while still respecting filters
    const genreMatch =
      filters.genre.length === 0 || filters.genre.includes(song.genre);

    const languageMatch =
      filters.language.length === 0 || filters.language.includes(song.language);

    const yearMatch =
      filters.releaseYear.length === 0 ||
      filters.releaseYear.includes(song.releaseDate);

    return searchMatch && genreMatch && languageMatch && yearMatch;
  });

  // delete a user (admin only)
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      // update frontend state
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete user");
    }
  };

  //UI
  return (
    <div className="page-container">
      {/* top bar with greeting and logout */}
      <div className="dashboard-topbar">
        <div className="dashboard-user">
          <p className="dashboard-eyebrow">Music Map</p>
          {/* <p>{user.username}</p> */}
          {user && (
            <h2 className="dashboard-greeting">
              Welcome back, {user.username}!
            </h2>
          )}
          <p className="dashboard-subtext">
            Build and manage your personal song collection.
          </p>

          {/* only show this admin section if the logged-in user has admin role */}
          {user?.role === "admin" && (
            <div className="admin-panel-preview">
              <h4>Admin Access Enabled</h4>
              <p>
                You have admin permissions. You can view the member list below.
              </p>

              <div className="admin-users-list">
                <h5>Member List</h5>

                {!Array.isArray(users) || users.length === 0 ? (
                  <p className="admin-empty">No users found.</p>
                ) : (
                  users.map((member) => (
                    <div key={member._id} className="admin-user-card">
                      <p>
                        <strong>Username:</strong> {member.username}
                      </p>
                      <p>
                        <strong>Role:</strong> {member.role}
                      </p>

                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDeleteUser(member._id)}
                      >
                        Delete User
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
        <Link to="/general">View general page</Link>
      </div>
      {/* small backend status card */}
      {/* <div className="status-card">
        <p className="status-label">Frontend meets Backend</p>
        <p className="status-message">Server says: {message}</p>
      </div> */}
      <header className="main-header">
        <h1>Song Collection Dashboard</h1>
        <p className="header-subtext">
          Add tracks, organize details, and browse your collection in one place.
        </p>
      </header>
      <div className="lyric-testing">
        <p>{lyrics.lyrics}</p>
        <p>there should eb lyrics above me</p>
      </div>
      <div className="content-wrapper">
        {/* /////////// LEFT PANEL /////////// */}
        {/* left panel: data entry form*/}
        <div className="left-panel">
          <div className="card form-card">
            <h3>Add New Song</h3>
            <p className="form-description">
              Enter song details to add a new track to your collection.
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
              <button
                className="primary-btn"
                type="submit"
                onClick={handleSubmit}
              >
                Add Song
              </button>
            </form>
          </div>
        </div>

        {/* /////////// RIGHT PANEL /////////// */}
        {/* right panel: the grid of songs & changes to detailed view on click */}
        <div className="right-panel">
          {selectedSong ? (
            /////////// DETAIL VIEW ///////////
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
                  onClick={() => handleDelete(selectedSong._id)}
                >
                  Delete Song
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => setSelectedSong(null)}
                >
                  ⬅ Back to Home
                </button>
              </div>
            </div>
          ) : (
            // /////////// SONG GRID + SEARCH & FILTER ///////////
            <>
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

                  {/* add whatever other genres here */}
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
                      value="Spanish"
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

                  {/* add whatever other languages here */}
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

                {/* add whatever other years here */}
              </div>

              <div className="section-heading">
                <h3>Your Collection</h3>
                <p>{songs.length} song(s)</p>
              </div>

              <div className="song-grid">
                {/* .map() loops through the 'songs' array.
                For every song item, it creates a <div> (song-card).
                */}
                {filteredSongs.map((song) => (
                  <div
                    key={song._id}
                    className="song-card"
                    // the 'key' prop is required by React for performance.
                    // It helps React track which items changed, added, or removed
                    onClick={() => setSelectedSong(song)}
                  >
                    <div className="image-container">
                      {/* conditional rendering:
                      IF song.imgUrl exists, show the Image.
                      ELSE (:), show the "No Image" placeholder.
                      */}
                      {song.imgUrl ? (
                        <img src={song.imgUrl} alt={song.title} />
                      ) : (
                        <div className="placeholder">No Cover</div>
                      )}
                    </div>

                    <div className="card-details">
                      <h3>{song.title}</h3>
                      <p>
                        <strong>Artist:</strong> {song.artist}
                      </p>
                      <p>
                        <strong>Album:</strong> {song.album}
                      </p>
                      <p>
                        <strong>Date:</strong> {song.releaseDate}
                      </p>

                      {/* we use an arrow function here () => handleDelete(...)
                      so the function only runs when CLICKED, not when the page
                      loads. */}

                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // prevents opening detail view when clicking delete
                          handleDelete(song._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
