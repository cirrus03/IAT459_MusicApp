import React, { useEffect, useState } from 'react';
import "./App.css";

function App() {
  /////////// STATES ////////////////
  const [message, setMessage] = useState("");

  // store the list of songs fetched from the database.
  // initial value is an empty array [] because we haven't fetched data yet.
  const [songs, setSongs] = useState([]);

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

  ////// USE EFFECT rendering ///////////////////

  //get the songs
  // this runs ONLY when the component first mounts (loads onto the screen) (empty dependency array)
  useEffect(() => {
    fetch("http://localhost:5000/api/songs")
      .then((res) => res.json()) // convert the raw response to JSON
      .then((data) => setSongs(data)) // save the data into our State
      .catch((err) => console.error("Error fetching songs:", err));
  }, []);

  //check if frontend and backend are connected from prev lab
  useEffect(() => {
    // Note: We use the FULL URL. There is no proxy to infer the host.
    fetch("http://localhost:5000/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
      const response = await fetch("http://localhost:5000/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      await fetch(`http://localhost:5000/api/songs/${id}`, {
        method: "DELETE",
      });

      // update Frontend: Keep all songs EXCEPT the one we just deleted
      setSongs(songs.filter((song) => song._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  //UI
  return (
    

    <div className="page-container">
      <div className="App">
        <p>Frontend meets Backend</p>
        <p>Server says: {message}</p>
      </div>

      <header className="main-header">
        <h1>Song Collection Dashboard</h1>
      </header>

      <div className="content-wrapper">
        {/* left panel: data entry form*/}
        <div className="left-panel">
          <div className="card form-card">
            
            <h3>Add New Song</h3>

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
                required
              />
              <label>Artist</label>
              <input
                name="artist"
                value={formData.artist}
                onChange={handleChange}
              />
              <label>Album</label>
              <input
                name="album"
                value={formData.album}
                onChange={handleChange}
              />
              <label>Release Date</label>
              <input
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
              />
              <label>Language</label>
              <input
                name="language"
                value={formData.language}
                onChange={handleChange}
              />
              <label>Genre</label>
              <input
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
              <label>Lyrics</label>
              <input
                name="lyrics"
                value={formData.lyrics}
                onChange={handleChange}
              />
              <button type="submit" onClick={handleSubmit}>Add Song</button>
            </form>

          </div>
        </div>

        {/* right panel: the grid of songs */}
        <div className="right-panel">
          <div className="song-grid">
            {/* .map() loops through the 'songs' array.
For every song item, it creates a <div> (song-card).
*/}
            {songs.map((song) => (
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
                    <div className="placeholder">No Image</div>
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
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(song._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* End content-wrapper */}
    </div>
  );
}





export default App;