// src/components/CookieManager.js
// Simple cookie utilities

export function setCookie(name, value, days = 7) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${d.toUTCString()}`;
  }
  
  export function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const [key, val] = v.split('=');
      return key === name ? decodeURIComponent(val) : r;
    }, '');
  }
  
  export function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }
  