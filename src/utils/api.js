import axios from 'axios';

// Central API helper: should add functions here for backend calls
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5100';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Required for cross-origin cookies
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


// Fetch all customers (admin/manager only)
export async function getCustomers() {
  return fetch(`${API_BASE}/customers`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => Array.isArray(data) ? data : []);
}

// Fetch current customer's data
export async function getCurrentCustomer() {
  return fetch(`${API_BASE}/customers/me`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch customer data');
      return res.json();
    });
}

// Create a new customer
export async function createCustomer(data) {
  return fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
}


// Delete a customer (admin only)
export async function deleteCustomer(customerId) {
  return fetch(`${API_BASE}/customers/${customerId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
}

// Reset loyalty points to zero (admin only)
export async function resetLoyaltyPoints(customerId) {
  return fetch(`${API_BASE}/customers/${customerId}/loyalty`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ points: 0 })
  });
}

// Add loyalty point to a customer (manager only)
export async function addLoyaltyPoint(customerId) {
  return fetch(`${API_BASE}/customers/${customerId}/loyalty`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ delta: 1 })
  });
}

// Subtract loyalty point from a customer (manager only)
export async function subtractLoyaltyPoint(customerId) {
  return fetch(`${API_BASE}/customers/${customerId}/loyalty`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ delta: -1 })
  });
}

// Update loyalty points for a customer (manager only)
export async function updateLoyaltyPoints(customerId, points) {
  return fetch(`${API_BASE}/customers/${customerId}/loyalty`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ points })
  });
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
