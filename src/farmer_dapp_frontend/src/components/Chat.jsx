// src/components/Chat.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function Chat() {
  const { state }     = useLocation();
  const navigate      = useNavigate();
  const { productId } = useParams();

  const { role, username, seller } = state || {};
  if (!productId || role!=='buyer') {
    navigate('/shop', { replace: true, state });
    return null;
  }

  // localStorage key per product
  const KEY = `chat_${productId}`;

  // load existing messages
  const [msgs, setMsgs] = useState(() => {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState('');

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(msgs));
  }, [msgs]);

  const sendMsg = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newMsg = {
      from: username,
      to: seller,
      at: new Date().toISOString(),
      text: text.trim(),
    };
    setMsgs((m) => [...m, newMsg]);
    setText('');
  };

  return (
    <div className="chat-container">
      <h2>Chat with {seller}</h2>
      <div className="chat-log">
        {msgs.map((m,i) => (
          <div
            key={i}
            className={`chat-bubble ${m.from===username?'out':'in'}`}
          >
            <p>{m.text}</p>
            <small>{new Date(m.at).toLocaleString()}</small>
          </div>
        ))}
        {msgs.length===0 && <p>No messages yet</p>}
      </div>
      <form className="chat-form" onSubmit={sendMsg}>
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
