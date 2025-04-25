// src/components/Forum.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar    from './NavBar';
import WidgetNav from './WidgetNav';

let nextPostId  = 3;
let nextReplyId = 1;

const Forum = () => {
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const role         = (state?.role||'guest').toLowerCase();
  const username     = state?.username || 'Guest';
  const profileIcon  = role==='guest' ? '❓' : '👤';

  const [query, setQuery]     = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newBody,  setNewBody]  = useState('');
  const [replyTo, setReplyTo]   = useState(null);
  const [replyBody, setReplyBody] = useState('');

//   Initial Sample Posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'How to improve yield?',
      body: 'Looking for tips on fertilizer schedules…',
      votes: 4,
      userVote: null,
      replies: [
        // Sample replies
        { id: 1, body: 'Try a balanced NPK fertilizer!', votes: 3, userVote: null },
        { id: 0, body: 'Try organic compost!', votes: 2, userVote: null },
      ],
    },
    {
      id: 2,
      title: 'Pest control tips',
      body: 'My tomatoes have aphids—any advice?',
      votes: 2,
      userVote: null,
      replies: [],
    },
  ]);

  // NEW! bulletproof vote logic
  const castVote = (id, type, isReply = false, parentId = null) => {
    setPosts((all) =>
      all.map((p) => {
        if (!isReply && p.id === id) {
          let delta = 0;
          if (p.userVote === type) {
            delta = type === 'up' ? -1 : +1;
            return { ...p, votes: p.votes + delta, userVote: null };
          } else {
            delta = type === 'up' ? +1 : -1;
            if (p.userVote) delta *= 2;
            return { ...p, votes: p.votes + delta, userVote: type };
          }
        }
        if (isReply && p.id === parentId) {
          const updatedReplies = p.replies.map((r) => {
            if (r.id !== id) return r;
            let delta = 0;
            if (r.userVote === type) {
              delta = type === 'up' ? -1 : +1;
              return { ...r, votes: r.votes + delta, userVote: null };
            } else {
              delta = type === 'up' ? +1 : -1;
              if (r.userVote) delta *= 2;
              return { ...r, votes: r.votes + delta, userVote: type };
            }
          });
          return { ...p, replies: updatedReplies };
        }
        return p;
      })
    );
  };

  // posting & replying
  const addPost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    setPosts([
      {
        id: nextPostId++,
        title: newTitle,
        body: newBody,
        votes: 0,
        userVote: null,
        replies: [],
      },
      ...posts,
    ]);
    setNewTitle('');
    setNewBody('');
  };

  const addReply = (e) => {
    e.preventDefault();
    if (!replyBody.trim() || replyTo == null) return;
    setPosts((all) =>
      all.map((p) =>
        p.id === replyTo
          ? {
              ...p,
              replies: [
                ...p.replies,
                {
                  id: nextReplyId++,
                  body: replyBody,
                  votes: 0,
                  userVote: null,
                },
              ],
            }
          : p
      )
    );
    setReplyTo(null);
    setReplyBody('');
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.body.toLowerCase().includes(query.toLowerCase())
  );

  const handleSettings = () =>
    navigate('/settings', { state });

  return (
    <div className="home-container">
      <div className="overlay" />

      <NavBar
        greeting="Forum"
        profileIcon={profileIcon}
        onSettings={handleSettings}
      />

      <div className="dashboard-content">
        {/* New post */}
        <div className="section">
          <form onSubmit={addPost}>
            <input
              className="input-field"
              placeholder="Post title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              className="input-field"
              placeholder="What’s on your mind?"
              rows={3}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
            />
            <button type="submit" style={{ marginTop: '8px' }}>
              Post
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="section">
          <input
            type="text"
            className="input-field"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Posts + replies */}
        <div
          className="section"
          style={{ maxHeight: '55vh', overflowY: 'auto' }}
        >
          {filtered.map((p) => (
            <div key={p.id} className="forum-post">
              <h4>{p.title}</h4>
              <p>{p.body}</p>

              <div className="forum-votes">
                <button
                  onClick={() => castVote(p.id, 'up')}
                  style={{ opacity: p.userVote === 'up' ? 1 : 0.5 }}
                >👍</button>
                <span>{p.votes}</span>
                <button
                  onClick={() => castVote(p.id, 'down')}
                  style={{ opacity: p.userVote === 'down' ? 1 : 0.5 }}
                >👎</button>
                <button
                  onClick={() => setReplyTo(p.id)}
                  style={{ marginLeft: 'auto' }}
                >Reply</button>
              </div>

              {/* replies */}
              <div className="reply-list">
                {p.replies.map((r) => (
                  <div
                    key={r.id}
                    className="forum-post"
                    style={{ marginLeft: 20 }}
                  >
                    <p>{r.body}</p>
                    <div className="forum-votes">
                      <button
                        onClick={() => castVote(r.id, 'up', true, p.id)}
                        style={{ opacity: r.userVote === 'up' ? 1 : 0.5 }}
                      >👍</button>
                      <span>{r.votes}</span>
                      <button
                        onClick={() => castVote(r.id, 'down', true, p.id)}
                        style={{ opacity: r.userVote === 'down' ? 1 : 0.5 }}
                      >👎</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* reply form */}
              {replyTo === p.id && (
                <form
                  onSubmit={addReply}
                  style={{ margin: '8px 0', marginLeft: 20 }}
                >
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Your reply..."
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                  />
                  <button type="submit" style={{ marginTop: '4px' }}>
                    Send
                  </button>
                </form>
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

export default Forum;
