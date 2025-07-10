// Central API helper: should add functions here for backend calls
const API_BASE = process.env.REACT_APP_API_BASE_URL;

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

// DO NOT hardcode URLs elsewhere; always use this file
