import React from 'react';

const Home = () => {
  const palette = {
    background: '#F0F8EC',     // Light mint from your mobile UI
    card: '#ffffff',
    primary: '#014421',        // Deep green used in mobile buttons
    accent: '#67AE6E',
    textDark: '#062B1F',
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: palette.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const contentStyle = {
    backgroundColor: palette.card,
    padding: '60px 40px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
    animation: 'fadeSlideUp 0.8s ease-out',
  };

  const headingStyle = {
    fontSize: '36px',
    color: palette.primary,
    marginBottom: '20px',
    fontWeight: '700',
  };

  const paragraphStyle = {
    fontSize: '18px',
    color: palette.textDark,
    lineHeight: '1.6',
  };

  const animationStyle = `
    @keyframes fadeSlideUp {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{animationStyle}</style>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={headingStyle}>Welcome to MobData</h1>
          <p style={paragraphStyle}>
            This is the homepage of our secure admin portal. Manage users, devices,
            and data access requests with confidence and control.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
