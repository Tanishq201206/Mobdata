import React from 'react';

const About = () => {
  const palette = {
    background: '#F0F8EC',     // Light mint green like in mobile
    card: '#ffffff',
    primary: '#014421',        // Dark green used in buttons
    accent: '#67AE6E',
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
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    maxWidth: '720px',
    width: '100%',
    textAlign: 'center',
    animation: 'slideFadeIn 0.9s ease-out',
  };

  const headingStyle = {
    fontSize: '34px',
    fontWeight: '700',
    color: palette.primary,
    marginBottom: '24px',
  };

  const paragraphStyle = {
    fontSize: '18px',
    color: palette.textDark,
    lineHeight: '1.7',
    textAlign: 'justify',
  };

  const animationCSS = `
    @keyframes slideFadeIn {
      0% {
        opacity: 0;
        transform: translateY(40px);
      }
      100% {
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
          <h1 style={headingStyle}>About Us</h1>
          <p style={paragraphStyle}>
            <strong>MobData</strong> is dedicated to providing secure, mobile-first data management solutions.
            Our platform empowers organizations to control access, verify devices, and protect sensitive data 
            through modern multi-factor authentication and device-based verification techniques.
            <br /><br />
            Our mission is to make data transmission from mobile devices secure, seamless, and verifiable.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
