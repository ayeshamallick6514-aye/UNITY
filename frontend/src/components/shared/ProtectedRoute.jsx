import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { getHomeRoute } from '../../utils/roleConfig';

/**
 * ProtectedRoute — wraps any route that requires authentication.
 *
 * Props:
 *   allowedRoles   string[]  — if provided, only these roles can access
 *   children       ReactNode
 *
 * Behaviour:
 *   • Unauthenticated → redirect to /select-role
 *   • Authenticated but wrong role → redirect to their own workspace home
 *   • Session expired → redirect to /select-role
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, isSessionExpired, logout } = useAuthStore();

  // Expire check on every render
  if (isSessionExpired()) {
    logout();
    return <Navigate to="/select-role" replace state={{ reason: 'session_expired' }} />;
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/select-role" replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own workspace instead of an error page
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return children;
}
