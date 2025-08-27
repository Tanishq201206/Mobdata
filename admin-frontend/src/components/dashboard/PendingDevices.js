import React, { useEffect, useState } from 'react';
import { getPendingDevices, approveDevice } from '../../services/api';

const PendingDevices = () => {
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

  const fetchPendingDevices = async () => {
    try {
      const response = await getPendingDevices();
      setDevices(response.data);
    } catch (err) {
      setError('Failed to fetch pending devices');
    }
  };

  useEffect(() => {
    fetchPendingDevices();
  }, []);

  const handleApprove = async (deviceId) => {
    try {
      const response = await approveDevice(deviceId);
      alert(response.data);
      fetchPendingDevices();
    } catch (err) {
      alert('Failed to approve device');
    }
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

  const buttonStyle = {
    marginTop: '8px',
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: palette.button,
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  };

  const buttonHover = {
    backgroundColor: palette.buttonHover,
    color: '#000',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Pending Devices</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {devices.length === 0 ? (
        <p style={{ textAlign: 'center', color: palette.text }}>No pending devices found.</p>
      ) : (
        <div style={gridStyle}>
          {devices.map((device) => (
            <div key={device.id} style={cardStyle}>
              <p><span style={labelStyle}>ID:</span> {device.id}</p>
              <p><span style={labelStyle}>IMEI:</span> {device.imei}</p>
              <p><span style={labelStyle}>UUID:</span> {device.uuid}</p>
              <p><span style={labelStyle}>Model:</span> {device.model}</p>
              <p><span style={labelStyle}>OS:</span> {device.os}</p>
              <p><span style={labelStyle}>User:</span> {device.user?.username}</p>
              <button
                style={buttonStyle}
                onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                onClick={() => handleApprove(device.id)}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingDevices;
