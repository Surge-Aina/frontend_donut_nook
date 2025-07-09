// src/utils/api.js

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// This is a private helper function to handle all fetch requests
async function _fetch(endpoint, options = {}) {
  const { body, ...customOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
  };

  const config = {
    // Default to 'GET' if no method is specified
    method: 'GET',
    ...customOptions,
    headers: {
      ...headers,
      ...customOptions.headers,
    },
  };

  // If a body is provided, stringify it
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    // if the server responds with a non-2xx code, it's an error
    if (!response.ok) {
      const errorData = await response.json();
      // Throw an error to be caught by the .catch() block
      throw new Error(errorData.message || 'Something went wrong');
    }
    
    // Otherwise, parse the JSON and return it
    return response.json();

  } catch (error) {
    console.error('API helper error:', error.message);
    // Re-throw the error so the component can handle it if needed
    throw error;
  }
}

// Standardized public functions for your components to use
export function get(endpoint) {
  return _fetch(endpoint);
}

export function post(endpoint, body) {
  return _fetch(endpoint, { method: 'POST', body });
}

export function put(endpoint, body) {
  return _fetch(endpoint, { method: 'PUT', body });
}

export function del(endpoint) {
  return _fetch(endpoint, { method: 'DELETE' });
}