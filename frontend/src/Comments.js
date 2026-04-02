import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.js";
import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user

function Comments() {

  ////////// STATES ///////////////

  //state for holding all comments from a song
  const [comments, setComments] = useState([]);

  //state for the comment response being typed
  const [formData, setFormData] = useState({
      textBody: ""
  });

  const [users, setUsers] = useState([]);

  //auth context for user verification
  const { token, user} = useContext(AuthContext);


  //////////// USE EFFECT /////////////////
  
  //fetch comments based on song id
  useEffect(()=> {  

  }, []);
  


  ////////// FUNCTIONS /////////////////////
  //handle on change

  //handle submit

  //delete a comment (if you are the user or admin)

  //edit commment?

  return(
    <div>
      <p>I am the comment component</p>

      <div className="form-container">

        <form onSubmit={handleCommentSubmit}>
          <label>Comment</label>
          <input
            name='textBody'
            value={formData.textBody}
            onChange={handleCommentChange}
            placeholder="Enter your comment here"
            required
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
        
    );
}