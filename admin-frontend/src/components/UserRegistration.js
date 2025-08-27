import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  registerUser,
  sendEmailOtp,
  verifyEmailOtp,
} from '../services/api';

const UserRegister = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [otp, setOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const palette = {
    background: '#F0F8EC',
    card: '#ffffff',
    inputBorder: '#90C67C',
    button: '#014421',
    buttonHover: '#198754',
    textDark: '#062B1F',
    error: '#dc3545',
    success: '#198754',
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: palette.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 16px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const formStyle = {
    backgroundColor: palette.card,
    padding: '30px 25px',
    borderRadius: '14px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    animation: 'fadeSlideUp 0.8s ease-out',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: `2px solid ${palette.inputBorder}`,
    fontSize: '15px',
    outline: 'none',
    width: '100%',
  };

  const labelStyle = {
    fontWeight: '600',
    color: palette.textDark,
    marginBottom: '4px',
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

  const hoverStyle = {
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

  const messageStyle = {
    textAlign: 'center',
    fontWeight: '600',
    color: message.includes('success') || emailVerified ? palette.success : palette.error,
    marginTop: '10px',
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = async () => {
    if (!isValidEmail(form.email)) {
      setMessage('Invalid email format.');
      return;
    }

    try {
      await sendEmailOtp(form.email);
      setOtpSent(true);
      setMessage('OTP sent to email ✅');
    } catch (err) {
      console.error(err);
      setMessage('Failed to send OTP: ' + err);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyEmailOtp(form.email, otp);
      if (response.data === "OTP verified successfully.") {
        setEmailVerified(true);
        setMessage('Email verified successfully ✅');
      } else {
        setMessage('Invalid OTP ❌');
      }
    } catch (err) {
      console.error(err);
      setMessage('Invalid OTP ❌');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      setMessage('Please verify your email before submitting.');
      return;
    }

    try {
      await registerUser(form);
      setMessage('User registered successfully ✅');
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Registration failed: ' + (error.response?.data || 'Unknown error'));
    }
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
          <div style={titleStyle}>Register New User</div>

          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <button
              type="button"
              style={buttonStyle}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
              onClick={handleSendOtp}
              disabled={!form.email}
            >
              Send OTP
            </button>
          </div>

          {otpSent && (
            <div>
              <label style={labelStyle}>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={inputStyle}
                required
              />
              <button
                type="button"
                style={buttonStyle}
                onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          )}

          <div>
            <label style={labelStyle}>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...buttonStyle,
              opacity: emailVerified ? 1 : 0.5,
              cursor: emailVerified ? 'pointer' : 'not-allowed',
            }}
            disabled={!emailVerified}
            onMouseOver={(e) => emailVerified && Object.assign(e.target.style, hoverStyle)}
            onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Register
          </button>

          {message && <p style={messageStyle}>{message}</p>}
        </form>
      </div>
    </>
  );
};

export default UserRegister;
