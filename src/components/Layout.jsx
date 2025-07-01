// src/components/Layout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCookie, eraseCookie } from './CookieManager';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const token = getCookie('token');
  const name = getCookie('name');
  const email = getCookie('email');
  const role = getCookie('role');

  const handleLogout = () => {
    eraseCookie('token');
    eraseCookie('name');
    eraseCookie('email');
    eraseCookie('role');
    navigate('/login');
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
        <h3>🍩 Donut Nook</h3>
        {token ? (
          <div>
            {/* ===== DEBUG LOGGING: You can delete from here ===== */}
            <div>✅ Logged in as:</div>
            <div>👤 Name: {name}</div>
            <div>📧 Email: {email}</div>
            <div>🧩 Role: {role}</div>
            {/* ===== to here. Now delete that. ===== */}
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login"><button>Login</button></Link>
        )}
      </header>
      <main style={{ marginTop: '2rem' }}>{children}</main>
    </div>
  );
};

export default Layout;
