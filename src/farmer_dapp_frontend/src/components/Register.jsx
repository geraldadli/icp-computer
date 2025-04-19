// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Register = () => {
  const { role } = useParams();
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (form.password.length < 6) e.password = 'Min 6 chars';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Must match';
    return e;
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length === 0) {
      // → call your backend/register logic here…
      navigate('/home', { state: { role } });
    }
  };

  return (
    <div className="welcome-container">
      <div className="overlay" />
      <img src={logo} alt="Logo" className="logo" />
      <h2>Welcome {roleLabel}</h2>

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

        {/* Email */}
        <div className="input-wrapper">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input-field"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <small>{errors.email}</small>}
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

        {/* Confirm Password */}
        <div className="input-wrapper">
          <input
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="input-field"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span
            className="toggle-icon"
            onClick={() => setShowConfirm((v) => !v)}
          >
            {showConfirm ? '🔓' : '🔒'}
          </span>
          {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
        </div>

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: 'auto' }}>
        Already have an account?{' '}
        <Link to={`/${role}/login`} className="text-highlight">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
