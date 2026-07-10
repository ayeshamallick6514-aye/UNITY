import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import authService  from '../services/authService';
import { getHomeRoute } from '../utils/roleConfig';

/**
 * useAuth — encapsulates the full authentication flow.
 *
 * Provides:
 *   login(identifier, password)  → handles OTP requirement
 *   verifyOtp(email, otp)        → completes sign-in, redirects to workspace
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

  // ─── Step 1: Login ──────────────────────────────────────────────────────────
  async function login(identifier, password) {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(identifier, password);

      if (data.requiresOtp) {
        // Gov user — move to OTP step
        setPendingEmail(data.email);
        setOtpMessage(data.message);
        setOtpPending(true);
      } else {
        // Citizen — direct login
        storeLogin(data.user, data.token, data.refreshToken);
        navigate(getHomeRoute(data.user.role), { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  // ─── Step 2: Verify OTP ────────────────────────────────────────────────────
  async function verifyOtp(email, otp) {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.verifyOtp(email, otp);
      storeLogin(data.user, data.token, data.refreshToken);
      setOtpPending(false);
      navigate(getHomeRoute(data.user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
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
      return data.message;
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions.');
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
