import { toast } from 'react-toastify';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setCookie, getCookie } from '../../components/CookieManager';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

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
      if (data.userId || data.id) setCookie('userId', data.userId || data.id);

      // Redirect based on role
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'manager') navigate('/manager/dashboard');
      else navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
      toast.error("Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-box">
        {/* header styling */}
        <h1 style={{ marginBottom: '1.5rem' }}>{form.isSignup ? 'Create Account' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>
          {/* input forms styling */}
          {form.isSignup && (
            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ marginBottom: '1rem' }}
              autoComplete="name"
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ marginBottom: '1rem' }}
            autoComplete="email"
          />



          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ marginBottom: '1rem' }}
            autoComplete={form.isSignup ? "new-password" : "current-password"}
          />
          
          {/* error message styling */}
          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
          
          {/* primary button styling */}
          <button 
            type="submit"
            style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            {form.isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {/* divider styling with "or" text */}
        <div className="text-center" style={{ 
          width: '100%', 
          maxWidth: '320px', 
          margin: '0.5rem auto 0.5rem',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            flexGrow: 1,
            height: '1px',
            backgroundColor: '#c4c8d0'
          }}></div>
          <div style={{
            margin: '0 10px',
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            or
          </div>
          <div style={{
            flexGrow: 1,
            height: '1px',
            backgroundColor: '#c4c8d0'
          }}></div>
        </div>


        {/* secondary button styling */}
        {form.isSignup ? (
          <button
            type="button"
            onClick={toggleMode}
            style={{ width: '100%', maxWidth: '320px' }}
          >
            Login
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleMode}
            style={{ width: '100%', maxWidth: '320px' }}
          >
            Sign up
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Auth;
