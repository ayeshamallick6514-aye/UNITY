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
