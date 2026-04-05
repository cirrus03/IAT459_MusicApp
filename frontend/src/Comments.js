import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.js";
import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user

function Comments(songId) {

  ////////// STATES ///////////////

  //state for holding all comments from a song
  const [comments, setComments] = useState([]);

  //state for the comment response being typed
  const [formData, setFormData] = useState({
      textBody: ""
  });

  //auth context for user verification
  const { token, user} = useContext(AuthContext);


  //////////// USE EFFECT /////////////////
  
  //fetch comments based on song id
  useEffect(()=> {  
    console.log(songId);
    console.log("id: "+ songId.songId);
  }, []);

  useEffect(()=> {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/comments/${songId.songId}`);
        const data = await res.json();
        console.log(data);
        setComments(data);

      } catch(error) {
        console.error(error);
      }
    }
    fetchComments();
  }, []);
  


  ////////// FUNCTIONS /////////////////////
  //handle on change
  const handleCommentChange= (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  //handle submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); //prevent default submission behaviour

    try {
      //post comment
      const response = await fetch(
        "http://localhost:5001/api/comments",
        {
          method: "POST" ,
          headers: {
            "Content-Type": "application/json",
            Authorization: token, //attach token to prove user auth when posting a comment
          },
          body: JSON.stringify({
            textBody: formData.textBody,
            songId: songId.songId,
          })
        }
      );

      //update comment state in UI
      const newComment = await response.json(); //get the new comment
      setComments([...comments, newComment]);  //spread operateor for prev comments and add new comment

      //clear comment box ui
      setFormData(
        {
          textBody: "",
        }
      );

    } catch (error) {
      console.error(error);
    }
  };

  //delete a comment (if you are the user or admin)

  //edit commment?

  return(
    <div>
      <div className="form-container"> 
      
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
                // onClick={handleCommentSubmit}
              >
                Post comment
              </button>
        </form>
        </div>

        <div>
          {
            (!comments || comments.length === 0) ? 
            ( <p>no comments available</p> ) : (
              comments.map((comment) => (
                <div key={comment._id}>
                  <p>{comment.author.username}</p>
                  <p>{comment.body}</p>
                </div>
              ))
            )
          }
        </div>

      </div>

    </div>
        
    );
}

export default Comments;