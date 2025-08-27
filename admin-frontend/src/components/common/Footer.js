import React from 'react';

const Footer = () => {
  const palette = {
    background: '#014421',  // Dark green used in your mobile UI
    text: '#ffffff',
  };

  const footerStyle = {
    backgroundColor: palette.background,
    color: palette.text,
    textAlign: 'center',
    padding: '16px 0',
    fontSize: '14px',
    marginTop: 'auto',
    fontFamily: "'Segoe UI', sans-serif",
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
  };

  return (
    <footer style={footerStyle}>
      <div>© 2025 MobData. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
