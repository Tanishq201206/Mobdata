import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8087'; // Replace with your machine IP or localhost for emulator

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (payload) => {
  return apiClient.post('/auth/login?client=mob', payload);
};

export const verifyOTP = async (payload) => {
  return apiClient.post('/auth/verify-otp?client=mob', payload);
};

// Later, you can add:
export const setNewPassword = async (payload) => {
  return apiClient.post('/auth/set-new-password', payload);
};

export const setupMFA = async (payload) => {
  return apiClient.post('/auth/setup-mfa', payload);
};

export const checkDevice = (uuid, token) =>
  apiClient.get(`/device/check?uuid=${encodeURIComponent(uuid)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const registerDevice = async (token, deviceData) => {
  try {
    const response = await apiClient.post('/device/register', deviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Device registration failed:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchMySubmissions = async (token) => {
  try {
    const response = await apiClient.get('/data/my-submissions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching submissions:', error.response?.data || error.message);
    throw error;
  }
};


export const getUserStatus = (username, token) => {
  return apiClient.get(`/app/user/status/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getDeviceByUsername = (username, token) => {
  return apiClient.get(`/device/attributes/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const requestDataAccess = (deviceId, token) => {
  return apiClient.post(`/data/request-permission/${deviceId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true, // Accept all status codes to handle 409
  });
};

export const submitDataPayload = async (deviceToken, jsonPayload, token) => {
  try {
    const response = await apiClient.post(
      '/data/submit',
      { token: deviceToken, jsonPayload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Don't throw on 4xx so caller can read response.status/message
        validateStatus: (s) => s >= 200 && s < 500,
      }
    );
    return response; // <-- return full response (status, data, etc.)
  } catch (error) {
    // Only network/timeouts/etc land here
    console.error('Error submitting data payload:', error);
    throw error;
  }
};
