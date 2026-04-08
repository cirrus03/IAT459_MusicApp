import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./App.css";

import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user

import Comments from "./Comments";
import SongDetails from "./SongDetails";

function Dashboard() {
  /////////// STATES ////////////////
  const [message, setMessage] = useState("");

  // store favorited song IDs for quick lookup
  const [favorites, setFavorites] = useState([]);

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
    imgUrl: "",
  });

  // states for searching and filtering
  const [searchQuery, setSearchQuery] = useState(""); // search input
  const [filters, setFilters] = useState({
    genre: [],
    language: [],
    releaseYear: [],
  });

  //state for the top 10 songs from soundcharts
  const [topSongs, setTopSongs] = useState([]);

  // tap into our AuthContext
  // we grab the token, the decoded user object (for the greeting),
  // and the logout function (to attach to our button)
  const { token, user, logout } = useContext(AuthContext);

  ////// USE EFFECT rendering ///////////////////

  //fetching lyric test
  // useEffect(() => {
  //   const fetchLyrics = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5001/api/lyrics");
  //       const data = await res.json();
  //       console.log(data);
  //       // setLyrics(data);
  //     } catch (err) {
  //       console.error("Error fetching lyrics test:", err);
  //     }
  //   };

  //   fetchLyrics();
  // }, []);

  // fetch user's favorites
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5001/api/profile", {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.favorites) {
            // store only IDs for easy checking
            setFavorites(data.favorites.map((song) => song._id));
          }
        })
        .catch((err) => console.error("Error fetching favorites:", err));
    }
  }, [token]);

  //soundcharts call
  useEffect(() => {
  const fetchSoundchartChart = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/soundchart/chart", {
        method: "GET",
      });

      const data = await res.json();

      console.log("frontend received from backend:", data);
      console.log("is array?", Array.isArray(data));

      if (Array.isArray(data)) {
        setTopSongs(data);
      } else {
        console.error("Expected array but got:", data);
        setTopSongs([]);
      }
    } catch (err) {
      console.error("Error fetching soundchart chart:", err);
      setTopSongs([]);
    }
  };

  fetchSoundchartChart();
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

  // toggle favorite / unfavorite
  const handleToggleFavorite = async (songId) => {
    try {
      const isFavorited = favorites.includes(songId);

      const url = `http://localhost:5001/api/profile/favorite/${songId}`;
      const method = isFavorited ? "DELETE" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) throw new Error("Failed to update favorite");

      // update UI instantly
      if (isFavorited) {
        setFavorites(favorites.filter((id) => id !== songId));
      } else {
        setFavorites([...favorites, songId]);
      }
    } catch (err) {
      console.error(err);
    }
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
        imgUrl:"",
        source: "user",
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

const handleTopTenSongClick = async (chartSong) => {
  try {
    const res = await fetch(
      "http://localhost:5001/api/songs/song-from-soundcharts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        uuid: chartSong.uuid,
        title: chartSong.songName || chartSong.name,
        artist: chartSong.artistName || chartSong.creditName,
        album: chartSong.albumName || "N/A",
        releaseDate: chartSong.releaseYear || "N/A",
        language: chartSong.language || "N/A",
        genre: chartSong.genre || "N/A",
        imgUrl: chartSong.imageUrl,
        source: "soundcharts",
        }),
      }
    );

    const savedToDbSong = await res.json();

    if (res.ok) {
      setSelectedSong({
        ...savedToDbSong, // contains _id for comments/favorites

        // overwrite/add richer data from Soundcharts
        album: chartSong.albumName,
        releaseDate: chartSong.releaseYear,
        language: chartSong.language,
        genre: chartSong.genre,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

  //UI
  return (
  <div className="page-container">
    {/* top bar with greeting and logout */}
    <div className="dashboard-topbar">
      <div className="dashboard-user">
        <p className="dashboard-eyebrow">Music Map</p>
        {user && (
          <h2 className="dashboard-greeting">
            Welcome back, {user.username}!
          </h2>
        )}
        <p className="dashboard-subtext">
          Build and manage your personal song collection.
        </p>
      </div>

      <div className="profile-top-actions">
        <Link to="/add-song" className="add-song-btn">
          + Add Song
        </Link>

        <Link to="/profile" className="profile-link-btn">
          Profile
        </Link>

        {user?.role === "admin" && (
          <Link to="/admin" className="profile-link-btn">
            Admin
          </Link>
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>

    <div className="content-wrapper">
      <div className="right-panel">
        {selectedSong ? (
          <SongDetails
            deleteSong={handleDelete}
            song={selectedSong}
            onBack={() => setSelectedSong(null)}
          />
        ) : (
          <>
            {/* TOP PICKS BANNER */}
            <section className="top-picks-banner">
              <div className="top-picks-banner-header">
                <div>
                  <p className="top-picks-label">Featured Now</p>
                  <h2>Top Picks</h2>
                  <p className="top-picks-subtext">
                    Today&apos;s top ten songs worldwide
                  </p>
                </div>
              </div>

              <div className="top-picks-row">
                {topSongs.map((song) => (
                  <div
                    key={song?.uuid}
                    className="top-pick-card"
                    onClick={() => handleTopTenSongClick(song)}
                  >
                    <div className="top-pick-image">
                      {song?.imageUrl ? (
                        <img src={song.imageUrl} alt={song.songName || song.name} />
                      ) : (
                        <div className="placeholder">Album art not found</div>
                      )}
                    </div>

                    <div className="top-pick-details">
                      <h3>{song.songName || song.name}</h3>
                      <p>{song.artistName || song.creditName}</p>
                      <span>{song.albumName || "N/A"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <header className="main-header">
              <h1>Song Collection Dashboard</h1>
              <p className="header-subtext">
                Add tracks, organize details, and browse your collection in one place.
              </p>
            </header>

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
              </div>

              <div className="filter-group">
                <h4>Release Year</h4>

                <label>
                  <input
                    type="checkbox"
                    name="releaseYear"
                    value="2026"
                    onChange={handleFilterChange}
                  />
                  2026
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="releaseYear"
                    value="2025"
                    onChange={handleFilterChange}
                  />
                  2025
                </label>

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
              <h3>User-Submitted Collection</h3>
              <p>{songs.length} song(s)</p>
            </div>

            <div className="song-grid">
              {filteredSongs.map((song) => (
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
                      <strong>Artist:</strong> {song.artist}
                    </p>
                    <p>
                      <strong>Album:</strong> {song.album}
                    </p>
                    <p>
                      <strong>Date:</strong> {song.releaseDate}
                    </p>

                    <button
                      className="favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(song._id);
                      }}
                    >
                      {favorites.includes(song._id)
                        ? "★ Favourited"
                        : "☆ Favourite"}
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
