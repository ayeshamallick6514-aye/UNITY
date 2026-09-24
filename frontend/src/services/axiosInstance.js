import axios from 'axios';
import { API_BASE } from '../utils/constants';

/**
 * Axios instance with base URL, auth injection, and 401 refresh handling.
 * All services import from this singleton.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s timeout to accommodate cloud cold starts
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor — inject JWT ────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // Read token from sessionStorage (where Zustand persists it)
    try {
      const raw = sessionStorage.getItem('unity-auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // Silent — no token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — normalize errors ──────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status  = error.response?.status;
    let message = error.response?.data?.message || error.message || 'Unknown error';

    if (status === 502 || status === 503 || status === 504) {
      message = 'Institutional backend service is currently initializing or restarting (HTTP 502 Bad Gateway). Please retry in 15 seconds.';
    } else if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
      message = 'Request timed out waiting for backend response. Please check your network connection.';
    } else if (message.includes('Network Error')) {
      message = 'Unable to connect to backend server. Please verify the API service is active.';
    }

    if (status === 401) {
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/verify-otp')) {
        sessionStorage.removeItem('unity-auth');
        window.location.href = '/select-role';
      }
    }

    return Promise.reject({ status, message });
  }
);

export default axiosInstance;
