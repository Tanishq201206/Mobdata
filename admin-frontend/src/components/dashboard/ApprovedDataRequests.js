import React, { useEffect, useState } from 'react';
import { getAllApprovedDataRequests } from '../../services/api';

const ApprovedDataRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  const palette = {
    background: '#E1EEBC',
    card: '#ffffff',
    border: '#90C67C',
    text: '#062B1F',
  };

  const fetchRequests = async () => {
    try {
      const response = await getAllApprovedDataRequests();
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch approved data requests.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const containerStyle = {
    backgroundColor: palette.background,
    minHeight: '100vh',
    padding: '30px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#014421',
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
    wordWrap: 'break-word',
  };

  const labelStyle = {
    fontWeight: '600',
    marginRight: '4px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Approved Data Requests</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {requests.length === 0 ? (
        <p style={{ textAlign: 'center', color: palette.text }}>No approved data requests found.</p>
      ) : (
        <div style={gridStyle}>
          {requests.map((req) => (
            <div key={req.id} style={cardStyle}>
              <p><span style={labelStyle}>ID:</span> {req.id}</p>
              <p><span style={labelStyle}>Username:</span> {req.username}</p>
              <p><span style={labelStyle}>Device UUID:</span> {req.deviceUUID}</p>
              <p><span style={labelStyle}>Model:</span> {req.deviceModel}</p>
              <p><span style={labelStyle}>Requested At:</span> {new Date(req.requestedAt).toLocaleString()}</p>
              <p><span style={labelStyle}>Approved At:</span> {new Date(req.approvedAt).toLocaleString()}</p>
              <p><span style={labelStyle}>Archived At:</span> {new Date(req.archivedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedDataRequests;
