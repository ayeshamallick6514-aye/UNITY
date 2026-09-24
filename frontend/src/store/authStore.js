import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ROLES, SESSION_TIMEOUT_MS } from '../utils/constants';
import { getHomeRoute } from '../utils/roleConfig';

/**
 * Authentication Store — single source of truth for user identity.
 * Persisted to sessionStorage (cleared on tab close for security).
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // ─── State ──────────────────────────────────────────────────
      user:            null,   // { id, name, email, role, department, avatar }
      token:           null,   // JWT access token
      refreshToken:    null,   // JWT refresh token
      isAuthenticated: false,
      sessionExpiry:   null,   // Timestamp (ms) when session expires

      // ─── Actions ────────────────────────────────────────────────

      /**
       * Called on successful login — stores user data and tokens.
       */
      login(user, token, refreshToken) {
        const sessionExpiry = Date.now() + SESSION_TIMEOUT_MS;
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          sessionExpiry,
        });
      },

      /**
       * Called on logout or session expiry — clears all auth state.
       */
      logout() {
        set({
          user:            null,
          token:           null,
          refreshToken:    null,
          isAuthenticated: false,
          sessionExpiry:   null,
        });
      },

      /**
       * Called by token refresh flow — updates access token only.
       */
      setToken(token) {
        set({ token });
      },

      /**
       * Extend session on user activity.
       */
      extendSession() {
        if (get().isAuthenticated) {
          set({ sessionExpiry: Date.now() + SESSION_TIMEOUT_MS });
        }
      },

      /**
       * Check if session has expired.
       */
      isSessionExpired() {
        const { sessionExpiry, isAuthenticated } = get();
        if (!isAuthenticated) return false;
        return sessionExpiry !== null && Date.now() > sessionExpiry;
      },

      /**
       * Convenience getter — returns the workspace home route for current user.
       */
      getHomeRoute() {
        const { user } = get();
        return user ? getHomeRoute(user.role) : '/select-role';
      },

      /**
       * Direct institutional login by role (for instant hackathon evaluation).
       */
      loginAsRole(roleName) {
        const sessionExpiry = Date.now() + SESSION_TIMEOUT_MS;
        let user;
        if (roleName === 'nodal_officer' || roleName === 'command') {
          user = {
            id: 'usr_002',
            name: 'Nodal Officer, Bhopal',
            email: 'nodal@bhopal.mp.gov.in',
            employeeId: 'NOD-BPL-1102',
            role: 'nodal_officer',
            department: 'State Command Secretariat',
            designation: 'Nodal Officer',
          };
        } else if (roleName === 'executive_engineer') {
          user = {
            id: 'usr_003',
            name: 'Executive Engineer (PWD)',
            email: 'pwd.exec@bhopal.mp.gov.in',
            employeeId: 'PWD-BPL-4412',
            role: 'executive_engineer',
            department: 'Public Works Department',
            designation: 'Executive Engineer',
          };
        } else {
          // Default: District Collector
          user = {
            id: 'usr_001',
            name: 'District Collector, Bhopal',
            email: 'collector@bhopal.mp.gov.in',
            employeeId: 'IAS-MP-2201',
            role: 'collector',
            department: 'District Collectorate',
            designation: 'District Collector',
          };
        }
        const token = 'unity_institutional_token_' + Date.now();
        set({
          user,
          token,
          refreshToken: token,
          isAuthenticated: true,
          sessionExpiry,
        });
        return user;
      },

      /**
       * Quick guest login for citizen portal browsing.
       */
      loginAsGuest() {
        set({
          user: { id: 'guest', name: 'Guest', role: ROLES.GUEST, department: null },
          token: null,
          refreshToken: null,
          isAuthenticated: false, // Guest is not "authenticated"
          sessionExpiry: null,
        });
      },
    }),
    {
      name:    'unity-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user:         state.user,
        token:        state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        sessionExpiry:   state.sessionExpiry,
      }),
    }
  )
);

export default useAuthStore;
