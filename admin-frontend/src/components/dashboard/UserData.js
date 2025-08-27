import React, { useState } from 'react';
import { getUserData } from '../../services/api';

const UserData = () => {
  const [username, setUsername] = useState('');
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

  const fetchData = async () => {
    try {
      const res = await getUserData(username);
      setDataList(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data for user');
      setDataList([]);
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
    overflowWrap: 'break-word',
  };

  const labelStyle = {
    fontWeight: '600',
    color: palette.text,
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>User Data</h2>
      <div style={inputGroupStyle}>
        <input
          type="text"
          value={username}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={fetchData}
          style={buttonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, hoverButtonStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        >
          Get User Data
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {dataList.length > 0 && (
        <div style={gridStyle}>
          {dataList.map((entry) => (
            <div key={entry.id} style={cardStyle}>
              <p><span style={labelStyle}>ID:</span> {entry.id}</p>
              <p>
                <span style={labelStyle}>Payload:</span><br />
                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{entry.jsonPayload}</span>
              </p>
              <p><span style={labelStyle}>Received At:</span> {new Date(entry.receivedAt).toLocaleString()}</p>
              <p><span style={labelStyle}>Model:</span> {entry.device.model}</p>
              <p><span style={labelStyle}>UUID:</span> {entry.device.uuid}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserData;
