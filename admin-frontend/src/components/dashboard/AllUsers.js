import React, { useEffect, useState } from 'react';
import { getAllUsers, enableUser, disableUser } from '../../services/api';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const palette = {
    background: '#E1EEBC',
    card: '#ffffff',
    border: '#90C67C',
    button: '#014421',
    buttonHover: '#67AE6E',
    text: '#062B1F',
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.content);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleToggleUser = async (user) => {
    try {
      if (user.enabled) {
        const res = await disableUser(user.id);
        alert(res.data);
      } else {
        const res = await enableUser(user.id);
        alert(res.data);
      }
      await fetchUsers();
    } catch (err) {
      alert('Action failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const containerStyle = {
    backgroundColor: palette.background,
    minHeight: '100vh',
    padding: '30px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
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
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: palette.button,
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: palette.buttonHover,
    color: '#000',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>All Users</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={gridStyle}>
        {users.map((user) => (
          <div key={user.id} style={cardStyle}>
            <p><span style={labelStyle}>ID:</span> {user.id}</p>
            <p><span style={labelStyle}>Username:</span> {user.username}</p>
            <p><span style={labelStyle}>Role:</span> {user.role}</p>
            <p><span style={labelStyle}>Enabled:</span> {user.enabled ? 'Yes' : 'No'}</p>
            <p><span style={labelStyle}>MFA:</span> {user.mfaEnabled ? 'Yes' : 'No'}</p>

            <button
              style={buttonStyle}
              onClick={() => handleToggleUser(user)}
              onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
            >
              {user.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
