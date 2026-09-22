import React, { useState, useEffect } from 'react';
import { Bell, LogOut, Shield, Lock, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

// ─── Role token map — no personal names ───────────────────────────────────────
const ROLE_TOKEN = {
  collector:          'DISTRICT_COLLECTOR',
  commissioner:       'MUNICIPAL_COMMISSIONER',
  executive_engineer: 'EXECUTIVE_ENGINEER',
  dept_officer:       'DEPT_OFFICER',
  nodal_officer:      'NODAL_OFFICER',
  chief_secretary:    'CHIEF_SECRETARY',
};

const NAV_ITEMS = [
  { label: 'Dashboard',          path: '/authority/dashboard'   },
  { label: 'Mission Control',    path: '/authority/projects'    },
  { label: 'GIS Utility Map',   path: '/authority/map'         },
  { label: 'Dept. Directory',   path: '/authority/departments' },
  { label: 'Escalations Log',   path: '/authority/coordination'},
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuthorityTopBar({ pageTitle = '' }) {
  const [time,     setTime]     = useState('');
  const [date,     setDate]     = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout }        = useAuthStore();
  const navigate                = useNavigate();
  const location                = useLocation();

  // Live IST clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false,   timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
      setDate(
        now.toLocaleDateString('en-IN', {
          weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
          timeZone: 'Asia/Kolkata',
        }).toUpperCase()
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

  const roleToken = ROLE_TOKEN[user?.role] ?? 'AUTHORIZED_OFFICER';

  return (
    <header className="shrink-0 z-30 font-sans select-none bg-white border-b border-slate-300">

      {/* ── TRICOLOR ACCENT STRIP ──────────────────────────────────────────── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* ── GOVERNMENT METADATA BAR ────────────────────────────────────────── */}
      <div className="bg-[#0B1B3D] px-5 py-1.5 flex items-center justify-between">
        {/* Left — jurisdiction identity */}
        <div className="flex items-center gap-3">
          {/* Ashoka Chakra placeholder — 24-spoke wheel */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-80">
            <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="3"  stroke="#ffffff" strokeWidth="1.5" fill="none" />
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad   = (angle * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={12 + Math.cos(rad) * 3.8}
                  y1={12 + Math.sin(rad) * 3.8}
                  x2={12 + Math.cos(rad) * 8.5}
                  y2={12 + Math.sin(rad) * 8.5}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  opacity="0.7"
                />
              );
            })}
          </svg>
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.18em] leading-none">
            Government of Madhya Pradesh&nbsp;&nbsp;•&nbsp;&nbsp;Bhopal District Administration
          </span>
        </div>

        {/* Right — secure session tokens */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/60 uppercase tracking-wider">
            <Lock size={9} className="text-amber-400 shrink-0" />
            TLS_1.3&nbsp;•&nbsp;SECURE_INTRANET
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-2.5 py-1 text-[9px] font-mono text-white font-bold uppercase tracking-wider">
            <span className="text-amber-400">[ROLE:</span>
            <span>{roleToken}</span>
            <span className="text-amber-400">]</span>
          </div>
          <div className="text-[9px] font-mono text-white/50 tracking-wider">
            BHOPAL_METRO_ZONE_01
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TAB BAR ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 flex items-center justify-between">
        {/* Nav tabs */}
        <nav className="flex items-center gap-0" aria-label="Authority navigation">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={[
                  'px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap',
                  active
                    ? 'border-[#0B1B3D] text-[#0B1B3D] bg-slate-50'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50',
                ].join(' ')}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right cluster — clock + bell + user */}
        <div className="flex items-center gap-3 py-1">
          {/* Clock */}
          <div className="hidden sm:block text-right">
            <p className="text-[11px] font-mono font-bold text-slate-800 tabular-nums leading-none">{time}</p>
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">{date}</p>
          </div>

          {/* Separator */}
          <div className="w-px h-7 bg-slate-200" />

          {/* Notifications */}
          <button
            className="relative p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
            aria-label="Notifications"
          >
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <div className="w-6 h-6 bg-[#0B1B3D] flex items-center justify-center shrink-0 text-white font-black text-xs">
                {roleToken[0]}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-widest">[{roleToken}]</p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">Authenticated</p>
              </div>
              <ChevronDown size={10} className="text-slate-400 hidden sm:block" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-300 shadow-lg z-20 py-1">
                  <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider">[ROLE: {roleToken}]</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">BHOPAL_METRO_ZONE_01</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">SESSION: SECURE_INTRANET_TOKEN</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors uppercase tracking-wider"
                  >
                    <LogOut size={13} />
                    Terminate Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
