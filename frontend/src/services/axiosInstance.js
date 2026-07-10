import axios from 'axios';
import { API_BASE } from '../utils/constants';

/**
 * Axios instance with base URL, auth injection, and 401 refresh handling.
 * All services import from this singleton.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
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
    const message = error.response?.data?.message || error.message || 'Unknown error';

    if (status === 401) {
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/verify-otp')) {
        // Could attempt refresh here; for now, let ProtectedRoute handle redirect
        sessionStorage.removeItem('unity-auth');
        window.location.href = '/select-role';
      }
    }

    return Promise.reject({ status, message });
  }
);

export default axiosInstance;
