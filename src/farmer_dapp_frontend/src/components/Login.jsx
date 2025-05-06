import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import logo from '../assets/logo.png';
// ii dummy: 2759707
const Login = () => {
  const { role } = useParams();
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const navigate = useNavigate();
  const isGuest = role === 'guest';

  const [identity, setIdentity] = useState(null);
  // principal will hold a Principal object
  const [principal, setPrincipal] = useState(null);
  const [method, setMethod] = useState('ii');
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        const id = await authClient.getIdentity();
        setIdentity(id);
        // getPrincipal() returns a Principal instance
        const princObj = id.getPrincipal();
        setPrincipal(princObj);
      }
    })();
  }, []);

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
      navigate('/home', {
        state: { role, username: form.username, method: 'email', principal: principal },
      });
    }
  };

  const handleII = async () => {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: 'https://identity.ic0.app',
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000000000),
      onSuccess: async () => {
        const id = await authClient.getIdentity();
        const text = id.getPrincipal().toText();
        // reconstruct Principal from text using Principal.fromText
        const princObj = Principal.fromText(text);
        setPrincipal(princObj);
        navigate('/home', {
          state: { role, username: princObj.toText(), method: 'ii', principal: princObj },
        });
      },
    });
  };

  if (isGuest) {
    navigate('/home', { replace: true, state: { role, username: 'Guest' } });
    return null;
  }

  return (
    <div className="welcome-container">
      <div className="overlay" />
      <img src={logo} alt="Logo" className="logo" />
      <h2>Hello! {roleLabel}</h2>

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

      {method === 'ii' ? (
        <div className="ii-flow">
          <p>Login using your Internet Identity</p>
          <button className="ii-btn" onClick={handleII}>
            Sign in with Internet Identity
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
        Donât have an account?{' '}
        <Link to={`/${role}/register`} className="text-highlight">
          Register now
        </Link>
      </p>
    </div>
  );
};

export default Login;