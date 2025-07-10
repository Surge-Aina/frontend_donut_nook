// src/components/CookieManager.js
// Simple cookie utilities

export function setCookie(name, value, days = 7) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Check if we're in production (cross-origin)
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    
    let cookieString = `${name}=${encodeURIComponent(value)};path=/;expires=${d.toUTCString()}`;
    
    // For cross-origin requests in production, we need specific settings
    if (isProduction) {
      // Note: SameSite=None requires Secure flag, but we'll handle this differently
      // For now, use SameSite=Lax which works better for cross-origin
      cookieString += ';samesite=lax';
    }
    
    document.cookie = cookieString;
    console.log(`🍪 Set cookie: ${name}`, { 
      value: value ? '***' : 'empty', 
      hostname: window.location.hostname,
      isProduction 
    });
  }
  
  export function getCookie(name) {
    const value = document.cookie.split('; ').reduce((r, v) => {
      const [key, val] = v.split('=');
      return key === name ? decodeURIComponent(val) : r;
    }, '');
    console.log(`🍪 Get cookie: ${name}`, { 
      value: value ? '***' : 'empty', 
      hostname: window.location.hostname,
      allCookies: document.cookie 
    });
    return value;
  }
  
  export function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }
  