import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.js";
import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user

function Comments() {

    //state for holding all comments from a song
    const [comments, setComments] = useState([]);

    //state for the comment response being typed
    const [formData, setFormData] = useState({
        textBody: ""
      });

    const [users, setUsers] = useState([]);

    //auth context for user verification
    const { token, user} = useContext(AuthContext);

    useEffect(()=>
        {

        }, []);


    return(
        <div>
            <p>I am the comment component</p>
        </div>
        
    );
}