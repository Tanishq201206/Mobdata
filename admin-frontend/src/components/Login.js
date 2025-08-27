import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginAdmin({ username, password });
      const data = response.data;

      localStorage.setItem("username", username);
      localStorage.setItem("password", password);

      if (data.message === "MFA not set up. Please complete setup at /auth/setup-mfa") {
        navigate('/setup-mfa');
      } else if (data.message === "MFA enabled. Please verify OTP using /auth/verify-otp") {
        navigate('/verify-otp');
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data || err.message));
    }
  };

  // MobData Theme Colors
  const palette = {
    background: '#F0F8EC',
    card: '#ffffff',
    border: '#90C67C',
    button: '#014421',
    buttonHover: '#198754',
    text: '#062B1F',
  };

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
    fontFamily: "'Segoe UI', sans-serif",
  };

  const formStyle = {
    backgroundColor: palette.card,
    padding: '30px 25px',
    borderRadius: '14px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    animation: 'fadeSlideUp 0.8s ease-out',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: `2px solid ${palette.border}`,
    fontSize: '15px',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: palette.button,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: palette.buttonHover,
    color: '#fff',
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: palette.button,
    marginBottom: '10px',
  };

  const animationCSS = `
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <>
      <style>{animationCSS}</style>
      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={titleStyle}>Admin Login</div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
            onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
