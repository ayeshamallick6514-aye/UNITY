import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import authService  from '../services/authService';
import { getHomeRoute } from '../utils/roleConfig';
import { API_BASE } from '../utils/constants';

/**
 * useAuth — encapsulates the complete authentication flow.
 *
 * Provides:
 *   login(identifier, password)  → authenticates and redirects to workspace
 *   verifyOtp(email, otp)        → stub (OTP disabled)
 *   logout()                     → clears store, redirects to /select-role
 *   forgotPassword(email)
 *   loading, error, otpPending, pendingEmail
 */
export default function useAuth() {
  const navigate = useNavigate();
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [otpPending,   setOtpPending]   = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpMessage,   setOtpMessage]   = useState('');

  // ─── Login ─────────────────────────────────────────────────────────────────
  async function login(identifier, password) {
    setLoading(true);
    setError(null);

    try {
      const data = await authService.login(identifier, password);

      // ── Defensive extraction — handle both response shapes ─────────────────
      // Shape A (current): { requiresOtp: false, user, token, refreshToken }
      // Shape B (legacy):  { requiresOtp: true, email, name, role, message }

      const user         = data?.user         || null;
      const token        = data?.token        || null;
      const refreshToken = data?.refreshToken || null;

      // Validate we got a usable user object with a role
      if (!user || typeof user.role !== 'string') {
        const isLegacyOtpResponse = data?.requiresOtp === true;
        if (isLegacyOtpResponse) {
          setError('Server is using an older protocol. Please contact support or try again in a moment — the backend may be redeploying.');
        } else {
          setError(`Login failed: server returned an unexpected response. API: ${API_BASE}`);
        }
        return;
      }

      if (!token) {
        setError('Login failed: no authentication token received. Please try again.');
        return;
      }

      // ── Store session and navigate ─────────────────────────────────────────
      storeLogin(user, token, refreshToken);
      navigate(getHomeRoute(user.role), { replace: true });

    } catch (err) {
      // err is { status, message } from axiosInstance interceptor
      const msg = err?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // ─── Verify OTP (stub — disabled) ──────────────────────────────────────────
  async function verifyOtp(email, otp) {
    setError('OTP verification is disabled. Please use direct login.');
  }

  // ─── Logout ────────────────────────────────────────────────────────────────
  async function logout() {
    try { await authService.logout(); } catch { /* silent */ }
    storeLogout();
    navigate('/select-role', { replace: true });
  }

  // ─── Forgot Password ───────────────────────────────────────────────────────
  async function forgotPassword(email) {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.forgotPassword(email);
      return data?.message || 'Reset instructions sent.';
    } catch (err) {
      setError(err?.message || 'Failed to send reset instructions.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  function clearError() { setError(null); }

  return {
    login,
    verifyOtp,
    logout,
    forgotPassword,
    loading,
    error,
    clearError,
    otpPending,
    pendingEmail,
    otpMessage,
  };
}
