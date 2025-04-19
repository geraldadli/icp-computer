// src/components/Notification.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

const Notification = () => {
  const { state } = useLocation();
  const navigate    = useNavigate();

  const role     = (state?.role || 'guest').toLowerCase();
  const username = state?.username || 'Guest';
  const profileIcon = role === 'guest' ? '❓' : '👤';

  // sample data; replace with real API data later
  const [notes, setNotes] = useState([
    { id: 1, title: 'Title 1', body: 'Lorem ipsum dolor sit amet…', read: false },
    { id: 2, title: 'Title 2', body: 'Consectetur adipiscing elit…', read: false },
    { id: 3, title: 'Title 3', body: 'Sed do eiusmod tempor…', read: false },
    { id: 4, title: 'Title 4', body: 'Incididunt ut labore…', read: false },
    { id: 5, title: 'Title 5', body: 'Dolore magna aliqua…', read: false },
  ]);

  const markRead = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMenu     = () => { /* open sidebar */ };
  const handleSettings = () => navigate('/settings');

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
          {notes.map((note) => (
            <div
              key={note.id}
              className={`notification-item ${note.read ? 'read' : ''}`}
            >
              <div className="notification-title">{note.title}</div>
              <div className="notification-body">{note.body}</div>
              {!note.read && (
                <div
                  className="notification-action"
                  onClick={() => markRead(note.id)}
                >
                  Read
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <WidgetNav
        profileIcon={profileIcon}
        role={role}
        username={username}
      />
    </div>
  );
};

export default Notification;
