// apiConfig.js - Works everywhere
const getApiBaseUrl = () => {
  // If deployed (not localhost and not IP address)
  if (!window.location.hostname.match(/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)/)) {
    return window.location.origin; // Same domain as frontend
  }
  // Local development with mobile access
  return 'http://192.168.1.5:3000'; // Replace with your PC's local IP
};

export const API_BASE_URL = getApiBaseUrl();
