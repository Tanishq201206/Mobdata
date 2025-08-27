import React, { useState, useEffect } from 'react';
import { verifyOtp } from '../services/api';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (!username || !password) {
      alert("Missing credentials. Please login again.");
      navigate('/');
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    try {
      await verifyOtp({ username, password, otp });
      alert('MFA verified successfully!');
      localStorage.clear();
      navigate('/dashboard');
    } catch (err) {
      console.error('OTP Verification Failed', err);
      alert("OTP Verification failed");
    }
  };

  // MobData Design Palette
  const palette = {
    background: '#E1EEBC',     // Soft green background
    card: '#ffffff',
    border: '#014421',         // Dark green for borders
    button: '#014421',         // Dark green button
    buttonHover: '#67AE6E',    // Light green accent
    text: '#062B1F',           // Dark text
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: palette.background,
    fontFamily: "'Segoe UI', sans-serif",
  };

  const formStyle = {
    backgroundColor: palette.card,
    padding: '30px 25px',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
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
    color: '#000',
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
        <form style={formStyle} onSubmit={handleVerify}>
          <div style={titleStyle}>Verify OTP</div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={inputStyle}
            required
          />
          <button
            type="submit"
            style={hovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            Verify OTP
          </button>
        </form>
      </div>
    </>
  );
};

export default VerifyOTP;
