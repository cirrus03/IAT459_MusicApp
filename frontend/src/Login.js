// import necessary React hooks

import { useContext, useState } from "react";

// React Router tools

import { Link, useNavigate } from "react-router-dom";

// import our global authentication context
import { AuthContext } from "./context/AuthContext";

function Login() {

  // Local state to track what the user types into the login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Get the login function from our AuthContext
  // This will store the JWT token and update the app's login state
  const { login } = useContext(AuthContext);

  // Initialize navigation so we can redirect after login
  const navigate = useNavigate();


  // This function runs when the login form is submitted
  async function handleLogin(e) {
    e.preventDefault(); // prevents the default page refresh behavior of forms

    try {

      // Send a POST request to our backend authentication route
      // The username and password are sent in the request body
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Convert the response from JSON format
      const data = await res.json();

      // If the backend confirms the login was successful
      if (res.ok) {

        // Save the JWT token using our AuthContext
        // This also updates the app so it knows the user is logged in
        login(data.token);

        // Redirect the user to the main dashboard/home page
        navigate("/");

      } else {

        // If login fails (wrong password, user doesn't exist, etc.)
        alert(data.error || "Login failed");
      }

    } catch (err) {

      // Catch network/server errors
      console.error(err);
    }
  }


  return (

    // Outer container that centers the login card on the screen
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >

      

      {/* Login card container */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "rgba(17, 24, 39, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "18px",
          padding: "36px 30px",
        }}
      >

        {/* Title section of the login card */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>

          {/* App name */}
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#a855f7",
              fontSize: "0.9rem",
              fontWeight: "700",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Music Map
          </p>

          {/* Main heading */}
          <h2
            style={{
              margin: "0",
              color: "#f8fafc",
              fontSize: "2rem",
              fontWeight: "700",
            }}
          >
            Welcome Back
          </h2>

          {/* Description text */}
          <p
            style={{
              marginTop: "10px",
              color: "#94a3b8",
              fontSize: "0.98rem",
              lineHeight: "1.5",
            }}
          >
            Log in to manage your albums, artists, and favorite tracks.
          </p>

        </div>


        {/* Login form */}
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >

          {/* Username input field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                color: "#cbd5e1",
                fontSize: "0.95rem",
                fontWeight: "600",
              }}
            >
              Username
            </label>

            <input
              placeholder="Enter your username"
              value={username}

              // update the username state when the user types
              onChange={(e) => setUsername(e.target.value)}

              style={{
                padding: "14px 16px",
                fontSize: "1rem",
                borderRadius: "10px",
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                outline: "none",
              }}
            />
          </div>

          {/* Password input field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                color: "#cbd5e1",
                fontSize: "0.95rem",
                fontWeight: "600",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}

              // update the password state when the user types
              onChange={(e) => setPassword(e.target.value)}

              style={{
                padding: "14px 16px",
                fontSize: "1rem",
                borderRadius: "10px",
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                outline: "none",
              }}
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            style={{
              marginTop: "8px",
              padding: "14px",
              fontSize: "1rem",
              background: "#a855f7",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700",
              letterSpacing: "0.3px",
            }}
          >
            Log In
          </button>

        </form>

        {/* Link to the Register page */}
        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "0.95rem",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#c084fc",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </p>

        <Link style={{
          textAlign: "center",
          color: "#c084fc",
          fontWeight: "700",}} to="/general">View general page</Link>

        

      </div>
    </div>
  );
}

export default Login;