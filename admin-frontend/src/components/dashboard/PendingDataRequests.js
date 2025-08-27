import React, { useEffect, useState } from 'react';
import { getPendingDataRequests, approveDataRequest } from '../../services/api';

const PendingDataRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  const palette = {
    background: '#E1EEBC',
    card: '#ffffff',
    border: '#90C67C',
    button: '#014421',
    buttonHover: '#67AE6E',
    text: '#062B1F',
  };

  const fetchRequests = async () => {
    try {
      const response = await getPendingDataRequests();
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch pending requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const response = await approveDataRequest(requestId);
      alert(response.data);
      fetchRequests();
    } catch (err) {
      alert('Approval failed');
    }
  };

  const containerStyle = {
    backgroundColor: palette.background,
    minHeight: '100vh',
    padding: '30px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: palette.button,
    textAlign: 'center',
    marginBottom: '20px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  };

  const cardStyle = {
    backgroundColor: palette.card,
    border: `1.5px solid ${palette.border}`,
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    color: palette.text,
    fontSize: '14px',
  };

  const labelStyle = {
    fontWeight: '600',
    color: palette.text,
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: palette.button,
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHover = {
    backgroundColor: palette.buttonHover,
    color: '#000',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Pending Data Requests</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {requests.length === 0 ? (
        <p style={{ textAlign: 'center', color: palette.text }}>No pending data requests found.</p>
      ) : (
        <div style={gridStyle}>
          {requests.map((req) => (
            <div key={req.id} style={cardStyle}>
              <p><span style={labelStyle}>Request ID:</span> {req.id}</p>
              <p><span style={labelStyle}>Username:</span> {req.user.username}</p>
              <p><span style={labelStyle}>UUID:</span> {req.device.uuid}</p>
              <p><span style={labelStyle}>Model:</span> {req.device.model}</p>
              <p><span style={labelStyle}>Requested At:</span> {new Date(req.requestedAt).toLocaleString()}</p>
              <button
                style={buttonStyle}
                onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                onClick={() => handleApprove(req.id)}
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

export default PendingDataRequests;
