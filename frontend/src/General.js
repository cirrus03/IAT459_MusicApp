
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import "./App.css";
import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user


function General() {

    const {logout, token} = useContext(AuthContext);
    const [songs, setSongs] = useState([]);

    // states for searching and filtering
    const [searchQuery, setSearchQuery] = useState(""); // search input
    const [filters, setFilters] = useState({
        genre: [],
        language: [],
        releaseYear: [],
      });



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

      

    return(
        //if token is good (means they are logged in), show logout button
        //else, show log in/register
        <div>
            <h1>General View</h1>

            { (token) ? 
              <div>
                <button class="logout-btn" onClick={logout}>Log Out</button>
                <Link class="logout-btn" style={{marginBottom: "1rem"}} to="/">My Dashbboard</Link>
              </div>
               :
              <div>
                <Link class="logout-btn" style={{marginBottom: "1rem"}} to="/login">Login</Link> 
              </div>
            }

            <div class="song-view">
                {/* right panel: the grid of songs */}
        <div className="right-panel">
          {/* search and filter */}
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
            <h3>All Songs</h3>
            <p>{songs.length} song(s)</p>
          </div>

          <div className="song-grid">
            {/* .map() loops through the 'songs' array.
            For every song item, it creates a <div> (song-card).
            */}
            {filteredSongs.map((song) => (
              <div key={song._id} className="song-card">
                {/* the 'key' prop is required by React for performance.
                It helps React track which items changed, added, or removed.
                */}
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
                    <strong>Title:</strong> {song.title}
                  </p>
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
                </div>
              </div>
            ))}
            </div>
        </div>
    </div>
    </div>
    );
}

export default General;

