import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { checkOut, logOut } from '../../services/api';

const Header = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await checkOut();
        if (res.data.authenticated) {
          setAuthenticated(true);
          setUsername(res.data.username);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, [location]);

  const handleLogout = async () => {
    try {
      await logOut();
      setAuthenticated(false);
      setUsername('');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const palette = {
    bg: '#014421',
    text: '#ffffff',
    hover: '#198754',
    border: '#67AE6E',
  };

  const navbarStyle = {
    backgroundColor: palette.bg,
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const brandStyle = {
    color: palette.text,
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const linkStyle = {
    color: palette.text,
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'color 0.3s ease',
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: palette.hover,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonDangerStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={brandStyle}>MobData</Link>

      <div style={navLinksStyle}>
        <Link
          to="/"
          style={linkStyle}
          onMouseOver={(e) => e.target.style.color = palette.hover}
          onMouseOut={(e) => e.target.style.color = palette.text}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={linkStyle}
          onMouseOver={(e) => e.target.style.color = palette.hover}
          onMouseOut={(e) => e.target.style.color = palette.text}
        >
          About Us
        </Link>
        <Link
          to="/contact"
          style={linkStyle}
          onMouseOver={(e) => e.target.style.color = palette.hover}
          onMouseOut={(e) => e.target.style.color = palette.text}
        >
          Contact Us
        </Link>
        {!authenticated && (
          <Link
            to="/user-registration"
            style={linkStyle}
            onMouseOver={(e) => e.target.style.color = palette.hover}
            onMouseOut={(e) => e.target.style.color = palette.text}
          >
            User Registration
          </Link>
        )}
        {authenticated && (
          <Link
            to="/dashboard"
            style={linkStyle}
            onMouseOver={(e) => e.target.style.color = palette.hover}
            onMouseOut={(e) => e.target.style.color = palette.text}
          >
            Dashboard
          </Link>
        )}
      </div>

      <div style={navLinksStyle}>
        {authenticated ? (
          <>
            <span style={{ color: '#fff', fontWeight: '500', marginRight: '10px' }}>
              Welcome, {username || 'Admin'}
            </span>
            <button
              style={buttonDangerStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button
              style={buttonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#157347'}
              onMouseOut={(e) => e.target.style.backgroundColor = palette.hover}
            >
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
