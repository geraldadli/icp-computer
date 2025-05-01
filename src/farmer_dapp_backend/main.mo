// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
  const { role }      = useParams();
  const roleLabel     = role.charAt(0).toUpperCase() + role.slice(1);
  const navigate      = useNavigate();
  const isGuest       = role === 'guest';

  // method: 'ii' or 'email'
  const [method, setMethod] = useState('ii');
  const [form, setForm]     = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Required';
    if (!form.password) e.password = 'Required';
    return e;
  };

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length === 0) {
      // TODO: call backend/login
      navigate('/home', {
        state: { role, username: form.username, method: 'email' },
      });
    }
  };

  const handleII = () => {
    // TODO: integrate DFINITY II SDK and grab the principal as username
    const principal = 'abcd-4ya6g-iaaaa-aaaaa-cai'; // mock example
    navigate('/home', {
      state: { role, username: principal, method: 'ii' },
    });
  };

  if (isGuest) {
    // Guests skip Login
    navigate('/home', { replace: true, state: { role, username: 'Guest' } });
    return null;
  }

  return (
    <div className="welcome-container">
      <div className="overlay" />
      <img src={logo} alt="Logo" className="logo" />
      <h2>Hello! {roleLabel}</h2>

      {/* Method Switcher */}
      <div className="method-switcher">
        <button
          className={method === 'ii' ? 'active' : ''}
          onClick={() => setMethod('ii')}
        >Internet Identity</button>
        <button
          className={method === 'email' ? 'active' : ''}
          onClick={() => setMethod('email')}
        >Email & Password</button>
      </div>

      {/* Internet Identity Flow */}
      {method === 'ii' ? (
        <div className="ii-flow">
          <p>Login using your Internet Identity</p>
          <button className="ii-btn" onClick={handleII}>
            Sign in with II
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitEmail} className="auth-form">
          <div className="input-wrapper">
            <input
              name="username"
              placeholder="Username"
              className="input-field"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && <small>{errors.username}</small>}
          </div>

          <div className="input-wrapper">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input-field"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <small>{errors.password}</small>}
          </div>

          <button type="submit">Login</button>
        </form>
      )}

      <p style={{ marginTop: 'auto' }}>
        Don’t have an account?{' '}
        <Link to={`/${role}/register`} className="text-highlight">
          Register now
        </Link>
      </p>
    </div>
  );
};

export default Login;
