import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function Admin() {
  const { token, user, logout } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  // fetch users
  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5001/api/admin/users", {
        headers: { Authorization: token },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            setError(data.error || "Failed to load users");
          }
        })
        .catch(() => setError("Failed to load users"));
    }
  }, [token, user]);

  // fetch all songs
  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5001/api/songs")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSongs(data);
          } else {
            setError("Failed to load songs");
          }
        })
        .catch(() => setError("Failed to load songs"));
    }
  }, [user]);

  // delete user
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      setError("Could not delete user");
    }
  };

  // delete song
  const handleDeleteSong = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/songs/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (!res.ok) {
        throw new Error("Failed to delete song");
      }

      setSongs(songs.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      setError("Could not delete song");
    }
  };

  // block non-admins AFTER hooks
  if (user?.role !== "admin") {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Access Denied</h2>
          <p>You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-topbar">
        <div>
          <p className="dashboard-eyebrow">Music Map</p>
          <h2 className="dashboard-greeting">Admin Panel</h2>
          <p className="dashboard-subtext">
            Manage users and submitted songs.
          </p>
        </div>

        <div className="profile-top-actions">
          <Link to="/" className="profile-link-btn">
            Home
          </Link>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <p className="profile-empty">{error}</p>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={activeTab === "users" ? "admin-tab active-tab" : "admin-tab"}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>

        <button
          className={activeTab === "songs" ? "admin-tab active-tab" : "admin-tab"}
          onClick={() => setActiveTab("songs")}
        >
          Songs
        </button>
      </div>

      {activeTab === "users" && (
        <div className="card">
          <h3>Users</h3>

          {users.length === 0 ? (
            <p className="profile-empty">No users found.</p>
          ) : (
            users.map((u) => (
              <div key={u._id} className="admin-user-card">
                <p>
                  <strong>Username:</strong> {u.username}
                </p>
                <p>
                  <strong>Role:</strong> {u.role}
                </p>

                <button
                  className="admin-delete-btn"
                  onClick={() => handleDeleteUser(u._id)}
                >
                  Delete User
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "songs" && (
        <div className="card">
          <h3>All Songs</h3>

          {songs.length === 0 ? (
            <p className="profile-empty">No songs found.</p>
          ) : (
            songs.map((s) => (
              <div key={s._id} className="admin-user-card">
                <p>
                  <strong>Title:</strong> {s.title}
                </p>
                <p>
                  <strong>Artist:</strong> {s.artist}
                </p>

                <button
                  className="admin-delete-btn"
                  onClick={() => handleDeleteSong(s._id)}
                >
                  Delete Song
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;