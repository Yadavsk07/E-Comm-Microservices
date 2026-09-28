import axios from 'axios';

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RAW_TIMEOUT = import.meta.env.VITE_API_TIMEOUT;

export const API_TIMEOUT = RAW_TIMEOUT ? Number(RAW_TIMEOUT) : 15000;

// Direct API call configuration:
// In production, all API calls go directly to the backend API Gateway.
// In local development, relative path (empty string) routes requests through Vite's dev proxy
// unless VITE_DIRECT_API is set to 'true'.
const DEFAULT_PROD_URL = 'https://ecomm-microservices-api.duckdns.org';

export const API_BASE_URL = (() => {
  if (import.meta.env.DEV && import.meta.env.VITE_DIRECT_API !== 'true') {
    return '';
  }

  const base = RAW_BASE_URL && RAW_BASE_URL !== '/api' ? RAW_BASE_URL : DEFAULT_PROD_URL;
  return base.replace(/\/$/, '');
})();

export const TOKEN_STORAGE_KEY = 'shopvibe_jwt_token';
export const USER_STORAGE_KEY = 'shopvibe_user_data';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access issues
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration and errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized occurs on an authenticated route, notify auth context
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      // Don't auto-logout if the 401 was from the login endpoint itself!
      if (!url.includes('/api/auth/login')) {
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
