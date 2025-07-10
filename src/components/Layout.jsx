import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCookie, eraseCookie } from './CookieManager';

const Layout = ({ children, container }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getCookie('token');
  const name = getCookie('name');
  const email = getCookie('email');
  const role = getCookie('role');

  const handleLogout = () => {
    eraseCookie('token');
    eraseCookie('name');
    eraseCookie('email');
    eraseCookie('role');
    eraseCookie('userId');
    // Also clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // checks if the current page is the login page
  const isAuthPage = location.pathname === '/login';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff7f0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Full-width header */}
      <header
        style={{
          width: '100%',
          background: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem'
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/img/donutNookLogo.png"
              alt="Donut Nook Logo"
              style={{ height: 80, width: 'auto', display: 'block' }}
            />
          </Link>
          {/* Desktop nav */}
          <nav
            className="hidden md:flex"
            style={{ gap: '1.5rem', alignItems: 'center' }}
          >
            <Link
              to="/"
              className={`nav-link${location.pathname === '/' ? ' active' : ''}`}
            >
              Home
            </Link>
            
            <Link
              to="/menu"
              className={`nav-link${location.pathname === '/menu' ? ' active' : ''}`}
            >
              Menu
            </Link>
            <Link
              to="/specials"
              className={`nav-link${location.pathname === '/specials' ? ' active' : ''}`}
            >
              🎯 Specials
            </Link>
            <Link
              to="/about"
              className={`nav-link${location.pathname === '/about' ? ' active' : ''}`}
            >
              About
            </Link>
<<<<<<< HEAD
            {token && role === 'customer' && (
              <Link
                to="/customer/dashboard"
                className={`nav-link${location.pathname === '/customer/dashboard' ? ' active' : ''}`}
              >
                My Dashboard
              </Link>
            )}
            {token && (role === 'admin' || role === 'manager') && (
              <Link
                to={role === 'admin' ? '/admin/customers' : '/manager/customers'}
                className={`nav-link${location.pathname.includes('/customers') ? ' active' : ''}`}
              >
                Customers
              </Link>
=======
            {(role === 'manager' || role === 'admin') && (
              <Link to="/manager/specials" className={`nav-link${location.pathname === '/manager/specials' ? ' active' : ''}`}>Manage Specials</Link>
>>>>>>> origin/main
            )}
            {!token && !isAuthPage && (
              <Link to="/login" className="hidden md:inline-block">
                <button>Login / Sign Up</button>
              </Link>
            )}
            {token && (
              <>
                <span style={{ fontSize: 14 }}>👤 {name}</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </nav>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden"
            aria-label="Open navigation"
            style={{
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              fontSize: 32,
              cursor: 'pointer',
              padding: 0,
              marginLeft: 8
            }}
            onClick={() => setMobileNavOpen(v => !v)}
          >
            ☰
          </button>
        </div>
        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div
            className="md:hidden"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.5rem 0',
              zIndex: 20
            }}
          >
            <Link to="/" onClick={() => setMobileNavOpen(false)}>Home</Link>
            <Link to="/menu" onClick={() => setMobileNavOpen(false)}>Menu</Link>
            <Link to="/specials" onClick={() => setMobileNavOpen(false)}>🎯 Specials</Link>
            <Link to="/about" onClick={() => setMobileNavOpen(false)}>About</Link>
<<<<<<< HEAD
            {token && role === 'customer' && (
              <Link to="/customer/dashboard" onClick={() => setMobileNavOpen(false)}>
                My Dashboard
              </Link>
            )}
            {token && (role === 'admin' || role === 'manager') && (
              <Link 
                to={role === 'admin' ? '/admin/customers' : '/manager/customers'} 
                onClick={() => setMobileNavOpen(false)}
              >
                Customers
              </Link>
=======
            
            {(role === 'manager' || role === 'admin') && (
              <Link to="/manager/specials" onClick={() => setMobileNavOpen(false)}>Manage Specials</Link>
>>>>>>> origin/main
            )}
            {!token && !isAuthPage && (
              <Link to="/login" className="md:hidden" style={{ marginLeft: 16 }}>
                <button>Login / Sign Up</button>
              </Link>
            )}
            {token && (
              <>
                <span style={{ fontSize: 14 }}>👤 {name}</span>
                <button onClick={() => { setMobileNavOpen(false); handleLogout(); }}>Logout</button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main content area - below navbar */}
      <main
        style={{
          flex: 1,
          width: '100%',
          padding: '2rem 0.5rem',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {container ? (
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              padding: 32,
              margin: '2rem 0'
            }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default Layout;
