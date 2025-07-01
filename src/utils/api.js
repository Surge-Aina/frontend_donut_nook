// Central API helper: should add functions here for backend calls
const API_BASE = process.env.REACT_APP_API_BASE_URL;

// Example helper — interns, add more as needed:
export async function getPing() {
  return fetch(`${API_BASE}/test/ping`)
    .then(res => res.json());
}

// DO NOT hardcode URLs elsewhere; always use this file
