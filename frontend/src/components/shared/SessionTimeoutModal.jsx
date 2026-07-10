import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

/**
 * SessionTimeoutModal — session activity watcher.
 * Monitors keyboard/mouse movement, warns 1 minute before expiry, and forces logout.
 */
export default function SessionTimeoutModal() {
  const navigate = useNavigate();
  const { isAuthenticated, sessionExpiry, extendSession, logout } = useAuthStore();
  
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  // Monitor activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handler = () => {
      // Extend if warning is not currently visible
      if (!showWarning) {
        extendSession();
      }
    };

    events.forEach(ev => window.addEventListener(ev, handler));
    return () => events.forEach(ev => window.removeEventListener(ev, handler));
  }, [isAuthenticated, showWarning, extendSession]);

  // Expiry check interval loop
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) {
      setShowWarning(false);
      return;
    }

    const interval = setInterval(() => {
      const msLeft = sessionExpiry - Date.now();

      if (msLeft <= 0) {
        // Expired! Force clear
        clearInterval(interval);
        logout();
        navigate('/select-role', { replace: true, state: { reason: 'session_expired' } });
      } else if (msLeft <= 60000) {
        // Warn user in last 60 seconds
        setShowWarning(true);
        setSecondsRemaining(Math.max(0, Math.round(msLeft / 1000)));
      } else {
        // Reset warning if session was extended
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiry, logout, navigate]);

  function handleExtend() {
    extendSession();
    setShowWarning(false);
  }

  function handleLogout() {
    logout();
    setShowWarning(false);
    navigate('/select-role', { replace: true });
  }

  const footer = (
    <>
      <Button variant="secondary" onClick={handleLogout}>
        Sign Out Now
      </Button>
      <Button variant="primary" onClick={handleExtend}>
        Extend Session
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={showWarning}
      onClose={handleExtend}
      title="Session Expiry Warning"
      footer={footer}
      size="sm"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-700">
          Due to inactivity, your government session is set to expire in:
        </p>
        <div className="text-center py-4 bg-gray-50 border border-gray-100 rounded-md">
          <span className="text-2xl font-bold font-mono text-red-600">
            {secondsRemaining}s
          </span>
        </div>
        <p className="text-xs text-gray-400">
          For security protocols, active coordination sessions must auto-terminate after timeout periods.
        </p>
      </div>
    </Modal>
  );
}
