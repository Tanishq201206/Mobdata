import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // MobData color palette
  const palette = {
    background: '#E1EEBC',  // Soft green background
    card: '#ffffff',
    button: '#014421',      // Dark green button
    buttonHover: '#67AE6E', // Light green hover
    text: '#ffffff',
    hoverText: '#000000',
  };

  const containerStyle = {
    padding: '40px',
    maxWidth: '1000px',
    margin: '40px auto',
    backgroundColor: palette.background,
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 0.8s ease-in-out',
    fontFamily: "'Segoe UI', sans-serif",
    color: palette.button,
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '34px',
    color: palette.button,
    marginBottom: '30px',
    fontWeight: '700',
  };

  const navStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  };

  const buttonBase = {
    padding: '12px 20px',
    backgroundColor: palette.button,
    color: palette.text,
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    minWidth: '200px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  };

  const fadeInKeyframes = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  // Button style manager
  const handleMouseOver = (e) => {
    Object.assign(e.target.style, {
      backgroundColor: palette.buttonHover,
      color: palette.hoverText,
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 18px rgba(0, 0, 0, 0.2)',
    });
  };

  const handleMouseOut = (e) => {
    Object.assign(e.target.style, buttonBase);
  };

  return (
    <>
      <style>{fadeInKeyframes}</style>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Admin Dashboard</h2>
        <nav style={navStyle}>
          {[
            { path: '/dashboard/users', label: 'All Users' },
            { path: '/dashboard/devices', label: 'All Devices' },
            { path: '/dashboard/data', label: 'All Data' },
            { path: '/dashboard/pendingDevices', label: 'Pending Devices' },
            { path: '/dashboard/userDevices', label: "User's Devices" },
            { path: '/dashboard/userData', label: "User's Data" },
            { path: '/dashboard/pendingDataRequests', label: 'Pending Data Requests' },
            { path: '/dashboard/approvedDataRequests', label: 'Approved Data Requests' },
          ].map(({ path, label }) => (
            <button
              key={path}
              style={{ ...buttonBase }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminDashboard;
