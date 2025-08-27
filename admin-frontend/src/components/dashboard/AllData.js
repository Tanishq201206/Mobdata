import React, { useEffect, useState } from 'react';
import { getAllData } from '../../services/api';

const AllData = () => {
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState(null);

  const palette = {
    background: '#E1EEBC',
    card: '#ffffff',
    border: '#90C67C',
    button: '#014421',
    buttonHover: '#67AE6E',
    text: '#062B1F',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllData();
        setDataList(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
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
    color: palette.button,
    textAlign: 'center',
    marginBottom: '20px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '18px',
  };

  const cardStyle = {
    backgroundColor: palette.card,
    border: `1.5px solid ${palette.border}`,
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    fontSize: '14px',
    color: palette.text,
    wordBreak: 'break-word',
  };

  const labelStyle = {
    fontWeight: '600',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>All Data</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={gridStyle}>
        {dataList.map((entry) => (
          <div key={entry.id} style={cardStyle}>
            <p><span style={labelStyle}>ID:</span> {entry.id}</p>
            <p><span style={labelStyle}>Payload:</span> {entry.jsonPayload}</p>
            <p><span style={labelStyle}>Received At:</span> {new Date(entry.receivedAt).toLocaleString()}</p>
            <p><span style={labelStyle}>User:</span> {entry.user.username}</p>
            <p><span style={labelStyle}>Device Model:</span> {entry.device.model}</p>
            <p><span style={labelStyle}>Device UUID:</span> {entry.device.uuid}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllData;
