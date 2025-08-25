import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9191/api/medical-owner',
});

// Add Authorization header if token is present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('medicalOwnerToken'); // or whatever key you used
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
