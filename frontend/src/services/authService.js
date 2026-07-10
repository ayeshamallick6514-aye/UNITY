import axiosInstance from './axiosInstance';

/**
 * authService — all authentication API calls.
 * Keeps API logic out of components and hooks.
 */
const authService = {
  /**
   * Step 1 — Submit credentials.
   * Returns { requiresOtp, email, name, role } for gov roles
   * or { user, token, refreshToken } for citizens (no OTP).
   */
  async login(identifier, password) {
    return axiosInstance.post('/auth/login', { identifier, password });
  },

  /**
   * Step 2 — Submit OTP received via SMS/email.
   * Returns { user, token, refreshToken }.
   */
  async verifyOtp(email, otp) {
    return axiosInstance.post('/auth/verify-otp', { email, otp });
  },

  /**
   * Refresh access token using stored refresh token.
   * Returns { token }.
   */
  async refresh(refreshToken) {
    return axiosInstance.post('/auth/refresh', { refreshToken });
  },

  /**
   * Trigger password reset for given email.
   */
  async forgotPassword(email) {
    return axiosInstance.post('/auth/forgot-password', { email });
  },

  /**
   * Server-side logout (stateless — just clears client session).
   */
  async logout() {
    return axiosInstance.post('/auth/logout');
  },

  /**
   * Get current user from token.
   */
  async me() {
    return axiosInstance.get('/auth/me');
  },
};

export default authService;
