import React, {useState } from 'react';
import { getUserDevices } from '../../services/api';

const UserDevices = () => {
  const [username, setUsername] = useState('');
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  const fetchDevices = async () => {
    try {
      const response = await getUserDevices(username);
      setDevices(response.data);
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Failed to fetch devices');
    }
  };

  const palette = {
    background: '#E1EEBC',
    card: '#ffffff',
    border: '#90C67C',
    button: '#014421',
    buttonHover: '#67AE6E',
    text: '#062B1F',
  };

  const containerStyle = {
    backgroundColor: palette.background,
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: palette.button,
    textAlign: 'center',
    marginBottom: '20px',
  };

  const inputGroupStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const inputStyle = {
    padding: '10px',
    border: `2px solid ${palette.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    width: '220px',
  };

  const buttonStyle = {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: palette.button,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const hoverButtonStyle = {
    backgroundColor: palette.buttonHover,
    color: '#000',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '14px',
  };

  const cardStyle = {
    backgroundColor: palette.card,
    border: `1.5px solid ${palette.border}`,
    borderRadius: '10px',
    padding: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    color: palette.text,
    fontSize: '13px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const labelStyle = {
    fontWeight: '600',
    color: palette.text,
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>User Devices</h2>
      <div style={inputGroupStyle}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={fetchDevices}
          style={buttonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, hoverButtonStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        >
          Fetch Devices
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {devices.length > 0 && (
        <div style={gridStyle}>
          {devices.map((device) => (
            <div key={device.id} style={cardStyle}>
              <p><span style={labelStyle}>DeviceID:</span> {device.id}</p>
              <p><span style={labelStyle}>IMEI:</span> {device.imei}</p>
              <p><span style={labelStyle}>UUID:</span> {device.uuid}</p>
              <p><span style={labelStyle}>Model:</span> {device.model}</p>
              <p><span style={labelStyle}>OS:</span> {device.os}</p>
              <p><span style={labelStyle}>Verified:</span> {device.verified ? '✅ Yes' : '❌ No'}</p>
              <p><span style={labelStyle}>Data Sending:</span> {device.dataSendingEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDevices;
