// Simple cookie utils —  can extend for more features
export function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  
  export function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days*864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`;
  }
  
  // DO NOT use localStorage for auth; cookies required for backend tracking
  