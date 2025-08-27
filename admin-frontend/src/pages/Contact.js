import React from 'react';

const Contact = () => {
  const palette = {
    background: '#F0F8EC',     // Matches mobile app background
    card: '#ffffff',
    primary: '#014421',        // Deep green for heading
    textDark: '#062B1F',
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: palette.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const cardStyle = {
    backgroundColor: palette.card,
    padding: '50px 40px',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    animation: 'fadeInSlideUp 0.8s ease-out',
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: palette.primary,
    marginBottom: '24px',
  };

  const textStyle = {
    fontSize: '18px',
    color: palette.textDark,
    marginBottom: '14px',
    lineHeight: '1.5',
  };

  const animationCSS = `
    @keyframes fadeInSlideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{animationCSS}</style>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Contact Us</h1>
          <p style={textStyle}>📧 Email: support@myapp.com</p>
          <p style={textStyle}>📞 Phone: +91 12345 67890</p>
        </div>
      </div>
    </>
  );
};

export default Contact;
