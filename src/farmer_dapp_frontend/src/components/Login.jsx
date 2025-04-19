// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
  const { role } = useParams();
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Required';
    if (!form.password) e.password = 'Required';
    return e;
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length === 0) {
      // → call your backend/login logic…
      navigate('/home', { state: { role } });
    }
  };

  return (
    <div className="welcome-container">
      <div className="overlay" />
      <img src={logo} alt="Logo" className="logo" />
      <h2>Hello! {roleLabel}</h2>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        {/* Username */}
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

        {/* Password */}
        <div className="input-wrapper">
          <input
            name="password"
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            className="input-field"
            value={form.password}
            onChange={handleChange}
          />
          <span
            className="toggle-icon"
            onClick={() => setShowPass((v) => !v)}
          >
            {showPass ? '🔓' : '🔒'}
          </span>
          {errors.password && <small>{errors.password}</small>}
        </div>

        <button type="submit">Login</button>
      </form>

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
