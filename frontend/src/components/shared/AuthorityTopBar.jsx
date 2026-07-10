import React, { useState, useEffect } from 'react';
import { Bell, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function AuthorityTopBar({ pageTitle = '' }) {
  const [time, setTime]             = useState('');
  const [menuOpen, setMenuOpen]     = useState(false);
  const { user, logout }            = useAuthStore();
  const navigate                    = useNavigate();

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function handleLogout() {
    logout();
    navigate('/select-role', { replace: true });
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-4 shrink-0 z-20 font-sans select-none">

      {/* Page Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <h1 className="text-xs font-black text-slate-900 uppercase tracking-widest whitespace-nowrap">
          {pageTitle || 'Operations Dashboard'}
        </h1>
        <div className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded text-[9px] font-mono text-slate-500 font-bold uppercase">
          <Shield size={10} className="text-blue-900" />
          <span>Secure Intra-Net Session</span>
        </div>
      </div>

      {/* Clock */}
      <span className="text-xs font-mono text-slate-400 font-semibold tabular-nums hidden sm:block">
        {time}
      </span>

      {/* Notifications */}
      <button
        className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors border border-transparent"
        aria-label="Notifications"
      >
        <Bell size={15} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" aria-hidden="true" />
      </button>

      {/* User Actions */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200/40"
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <div className="w-6 h-6 rounded-md bg-blue-900 flex items-center justify-center shrink-0 text-white font-bold text-xs">
            {user?.name?.[0]?.toUpperCase() ?? 'O'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[11px] font-bold text-slate-800 leading-none">Authorized Authority</p>
            <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider leading-none mt-1">
              Executive Access
            </p>
          </div>
          <ChevronDown size={11} className="text-slate-400 hidden sm:block" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
