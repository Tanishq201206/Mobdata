

import axios from 'axios';

const BASE_URL = 'http://localhost:8087';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ Include cookies in all requests
});



api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.log('Session expired or unauthorized. Please log in again.'+error.response+error.response.status);
      localStorage.clear(); // Only clears username/password used pre-OTP
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ✅ API Endpoints — NO Authorization headers needed manually
export const loginAdmin = (credentials) => api.post('/auth/login?client=web', credentials);

export const setupMfa = (credentials) => api.post('/auth/setup-mfa', credentials);

export const verifyOtp = (otpData) => api.post('/auth/verify-otp?client=web', otpData);

export const registerUser = (userData) => api.post('/auth/register', userData);

export const getAllUsers = () => api.get('/admin/manage/users');

export const getAllDevices = () => api.get('/admin/manage/devices');

export const getAllData = () => api.get('/admin/data/all');

export const getPendingDevices = () => api.get('/admin/devices/pending');

export const getUserDevices = (username) => api.get(`/admin/manage/devices/user/${username}`);

export const getUserData = (username) => api.get(`/admin/data/user/${username}`);

export const getPendingDataRequests = () => api.get('/admin/data-requests/pending');

export const getAllApprovedDataRequests = () => api.get('/admin/data-requests/all');

export const enableUser = (userId) => api.post(`/admin/manage/users/enable/${userId}`);

export const disableUser = (userId) => api.post(`/admin/manage/users/disable/${userId}`);

export const approveDevice = (deviceId) => api.post(`/admin/devices/approve/${deviceId}?enableData=true`);

export const approveDataRequest = (requestId) => api.post(`/admin/data-requests/approve/${requestId}`);

export const checkOut = () =>api.post('/auth/check');

export const logOut = () =>api.post('/auth/logout');

export const sendEmailOtp = (email) =>
  api.post('/auth/send-email-otp', null, {
    params: { email },
  });

export const verifyEmailOtp = (email, otp) =>
  api.post('/auth/verify-email-otp', null, {
    params: { email, otp },
  });

export const blockDevice = (deviceId) =>
  api.post(`/admin/devices/block/${deviceId}`);

export const unblockDevice = (deviceId) =>
  api.post(`/admin/devices/unblock/${deviceId}`);
