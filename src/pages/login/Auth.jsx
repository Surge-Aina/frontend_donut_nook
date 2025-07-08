// src/pages/login/Auth.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setCookie, getCookie } from '../../components/CookieManager';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    isSignup: false,
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = getCookie('token');
    const role = getCookie('role');
    if (token) {
      if (role === 'admin') return navigate('/admin/dashboard');
      if (role === 'manager') return navigate('/manager/dashboard');
      return navigate('/home');
    }
  }, [navigate]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleMode = () =>
    setForm({ isSignup: !form.isSignup, name: '', email: '', password: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = form.isSignup ? 'signup' : 'login';
      const payload = form.isSignup
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/${endpoint}`,
        payload
      );

      // Persist session in cookies
      setCookie('token', data.token);
      setCookie('role', data.role);
      // These may be undefined on signup, so check first
      if (data.name) setCookie('name', data.name);
      if (data.email) setCookie('email', data.email);

      // Redirect based on role
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'manager') navigate('/manager/dashboard');
      else navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{form.isSignup ? 'Create Account' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {form.isSignup && (
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <br />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : form.isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <button onClick={toggleMode} style={{ marginTop: '1rem' }}>
        {form.isSignup
          ? 'Have an account? Login'
          : 'No account? Sign up'}
      </button>
    </div>
  );
};

export default Auth;
