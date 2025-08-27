import React, { useEffect, useState } from 'react';
import { setupMfa } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SetupMFA = () => {
  const [qrImage, setQrImage] = useState('');
  const [secret, setSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (!username || !password) {
      alert("Missing credentials. Please login again.");
      navigate('/');
      return;
    }

    setupMfa({ username, password })
      .then((res) => {
        setQrImage(res.data.qrImageBase64);
        setSecret(res.data.secret);
      })
      .catch((err) => {
        console.error('MFA Setup Error', err);
        alert("MFA Setup failed");
      });
  }, [navigate]);

  return (
    <div>
      <h3>MFA Setup</h3>
      {qrImage ? (
        <div>
          <p><strong>Secret Key:</strong> {secret}</p>
          <img src={`data:image/png;base64,${qrImage}`} alt="QR Code" />
        </div>
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
};

export default SetupMFA;
