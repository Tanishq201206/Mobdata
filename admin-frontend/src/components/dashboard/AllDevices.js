import React, { useEffect, useState } from 'react';
import {
  getAllDevices,
  blockDevice,
  unblockDevice,
} from '../../services/api';

const AllDevices = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  const palette = {
    background: '#E1EEBC',
    card: '#ffffff',
    border: '#90C67C',
    button: '#014421',
    buttonHover: '#67AE6E',
    text: '#062B1F',
  };

  const fetchDevices = async () => {
    try {
      const response = await getAllDevices();
      setDevices(response.data.content);
    } catch (err) {
      setError('Failed to fetch devices');
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleBlockToggle = async (device) => {
    try {
      const response = device.blocked
        ? await unblockDevice(device.id)
        : await blockDevice(device.id);
      alert(response.data);
      fetchDevices();
    } catch (err) {
      alert('Failed to update block status');
    }
  };

  const containerStyle = {
    backgroundColor: palette.background,
    minHeight: '100vh',
    padding: '30px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '18px',
    marginTop: '20px',
  };

  const cardStyle = {
    backgroundColor: palette.card,
    border: `1.5px solid ${palette.border}`,
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    color: palette.text,
    fontSize: '14px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: palette.button,
    textAlign: 'center',
  };

  const labelStyle = {
    fontWeight: '600',
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: palette.button,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: palette.buttonHover,
    color: '#000',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>All Devices</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={gridStyle}>
        {devices.map((device) => (
          <div key={device.id} style={cardStyle}>
            <p><span style={labelStyle}>ID:</span> {device.id}</p>
            <p><span style={labelStyle}>IMEI:</span> {device.imei}</p>
            <p><span style={labelStyle}>UUID:</span> {device.uuid}</p>
            <p><span style={labelStyle}>Model:</span> {device.model}</p>
            <p><span style={labelStyle}>OS:</span> {device.os}</p>
            <p><span style={labelStyle}>User:</span> {device.user.username}</p>
            <p><span style={labelStyle}>Blocked:</span> {device.blocked ? 'Yes' : 'No'}</p>
            <button
              onClick={() => handleBlockToggle(device)}
              style={buttonStyle}
              onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
            >
              {device.blocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDevices;
