// import React hook for managing local component state
import { useState } from "react";

// import routing helpers
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

  // Local state to store the username and password entered by the user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for displaying any error messages from the backend
  const [error, setError] = useState("");

  // React Router navigation hook for redirecting users
  const navigate = useNavigate();


  // This function runs when the registration form is submitted
  const handleRegister = async (e) => {

    // Prevent the default HTML form behavior (page refresh)
    e.preventDefault();

    // Clear any previous error messages
    setError("");

    try {

      // Send a POST request to the backend registration endpoint
      // The username and password are sent in the request body
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Convert the server response into JSON
      const data = await res.json();


      // If registration is successful
      if (res.ok) {

        // Notify the user
        alert("Registration successful! Please log in.");

        // Redirect the user to the login page
        navigate("/login");

      } else {

        // If the backend returns an error (e.g., username already exists)
        setError(data.message || data.error || "Registration failed");
      }

    } catch (err) {

      // Catch any network or server errors
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  };


  return (

    // Outer container that centers the registration card on the page
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

      {/* Registration card container */}
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

        {/* Header section with app name and page title */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>

          {/* App title */}
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
            Join the Club
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
            Start building your personal music library.
          </p>
        </div>


        {/* Display error message if registration fails */}
        {error && (
          <p
            style={{
              color: "#f87171",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "18px",
            }}
          >
            {error}
          </p>
        )}

        {/* Registration form */}
        <form
          onSubmit={handleRegister}
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
              placeholder="Choose a username"
              value={username}

              // Update username state when the user types
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
              required
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
              placeholder="Choose a password"
              value={password}

              // Update password state when the user types
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
              required
            />
          </div>


          {/* Register button */}
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
            Register
          </button>

        </form>


        {/* Link to return to the login page */}
        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "0.95rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#c084fc",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Log in here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;