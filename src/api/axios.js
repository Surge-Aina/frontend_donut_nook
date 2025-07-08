import axios from 'axios';

// Set your backend base URL here
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5100/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token to every request if present in localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
