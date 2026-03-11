
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import "./App.css";
import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user


function General() {
    const {logout, token} = useContext(AuthContext);

    return(
        //if token is good (means they are logged in), show logout button
        //else, show log in/register
        <div>
            <h1>General View anyone can see</h1>
            <p>will put things here eventually</p>

            { (token) ? <button onClick={logout}>Log Out</button> :  <Link to="/login">Login</Link>}

        </div>
    );
}

export default General;

