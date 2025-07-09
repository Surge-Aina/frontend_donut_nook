import axios from 'axios';

// Central API helper: should add functions here for backend calls
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5100';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  // Try to get token from localStorage or cookies
  let token = localStorage.getItem('token');
  if (!token) {
    // Try cookies if not in localStorage
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    if (match) token = match[2];
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example helper — interns, add more as needed:
export async function getPing() {
  return fetch(`${API_BASE}/test/ping`)
    .then(res => res.json());
}

// Specials API functions
export const specialsAPI = {
  // Get all specials
  getAll: async () => {
    const response = await api.get('/specials');
    return response.data;
  },

  // Create a new special
  create: async (specialData) => {
    const response = await api.post('/specials', specialData);
    return response.data;
  },

  // Update an existing special
  update: async (id, specialData) => {
    const response = await api.patch(`/specials/${id}`, specialData);
    return response.data;
  },

  // Delete a special
  delete: async (id) => {
    const response = await api.delete(`/specials/${id}`);
    return response.data;
  }
};

// DO NOT hardcode URLs elsewhere; always use this file
