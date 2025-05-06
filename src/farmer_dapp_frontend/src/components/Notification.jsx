// src/components/Notification.jsx
import React, {useState, useEffect} from "react";

import {useLocation, useNavigate} from "react-router-dom";

import NavBar from "./NavBar";
import WidgetNav from "./WidgetNav";

const Notification = () => {
  const {state} = useLocation();
  const navigate = useNavigate();

  const role = (state?.role || "guest").toLowerCase();
  const username = state?.username || "Guest";
  const method = state?.method || "email";
  const profileIcon = method === "ii" ? "🆔" : role === "guest" ? "❓" : "👤";

  // sample data; replace with real API data later
  // const [notes, setNotes] = useState([
  //   { id: 1, title: 'Title 1', body: 'Order 1', read: true },
  //   { id: 2, title: 'Title 2', body: 'Order 2', read: true },
  //   { id: 3, title: 'Title 3', body: 'Order 3', read: false },
  //   { id: 4, title: 'Title 4', body: 'Order 4', read: false },
  //   { id: 5, title: 'Title 5', body: 'Order 5', read: false },
  // ]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotes(stored);
  }, []);

  const markRead = (id) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? {...n, read: true} : n)));
  };

  const handleMenu = () => {
    /* open sidebar */
  };
  
  const handleSettings = () => navigate("/settings");

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Notification"
        profileIcon={profileIcon}
        onMenu={handleMenu}
        onSettings={handleSettings}
      />

      <div className="dashboard-content">
        <div className="notification-section">
          {notes.length === 0 ? (
            <div style={{color: "black"}}>No notifications yet.</div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`notification-item ${note.read ? "read" : ""}`}>
                <div className="notification-title">{note.title}</div>
                <div className="notification-body">{note.body}</div>
                {!note.read && (
                  <div
                    className="notification-action"
                    onClick={() => markRead(note.id)}>
                    Read
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
        method={method}
      />
    </div>
  );
};

export default Notification;
