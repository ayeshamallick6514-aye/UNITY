import React, { useState, useEffect } from 'react';
import { Bell, LogOut, Shield, Lock, ChevronDown, Cpu, Menu, X, Landmark } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import SentinelAssistantModal from './SentinelAssistantModal';

// ─── Role token map — institutional identifiers ──────────────────────────────
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

export default function AuthorityTopBar({ pageTitle = '' }) {
  const [time,         setTime]         = useState('');
  const [date,         setDate]         = useState('');
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [mobileNavOpen,setMobileNavOpen]= useState(false);
  const [sentinelOpen, setSentinelOpen] = useState(false);
  const { user, logout }                = useAuthStore();
  const navigate                        = useNavigate();
  const location                        = useLocation();

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

      {/* ── GOVERNMENT METADATA BAR (Fully Responsive) ────────────────────── */}
      <div className="bg-[#0B1B3D] px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* Left — jurisdiction identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Ashoka Chakra vector */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-80">
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
          <span className="text-[9px] sm:text-[10px] font-bold text-white/90 uppercase tracking-[0.14em] sm:tracking-[0.18em] truncate">
            <span className="hidden sm:inline">Government of Madhya Pradesh&nbsp;&nbsp;•&nbsp;&nbsp;</span>Bhopal District Administration
          </span>
        </div>

        {/* Right — session metadata */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono text-white/60 uppercase tracking-wider">
            <Lock size={9} className="text-amber-400 shrink-0" />
            TLS_1.3&nbsp;•&nbsp;INTRANET
          </div>
          <div className="flex items-center gap-1 bg-white/10 border border-white/20 px-2 py-0.5 text-[8px] sm:text-[9px] font-mono text-white font-bold uppercase tracking-wider">
            <span className="text-amber-400 hidden xs:inline">[ROLE:</span>
            <span>{roleToken}</span>
            <span className="text-amber-400 hidden xs:inline">]</span>
          </div>
          <div className="hidden lg:block text-[9px] font-mono text-white/50 tracking-wider">
            BHOPAL_METRO_ZONE_01
          </div>
        </div>
      </div>

      {/* ── NAVIGATION & ACTION BAR (Desktop + Mobile Hamburger) ─────────── */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between h-12">

        {/* Left: Mobile hamburger toggle (lg:hidden) */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="text-xs font-black text-[#0B1B3D] uppercase tracking-wider">
            UNITY <span className="text-slate-400 text-[10px] font-normal">Authority</span>
          </span>
        </div>

        {/* Desktop Navigation Tabs (hidden on < lg) */}
        <nav className="hidden lg:flex items-center gap-0 h-full" aria-label="Authority navigation">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={[
                  'px-3.5 xl:px-4 h-full text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center',
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

        {/* Right cluster — Sentinel AI + Clock + Bell + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sentinel AI Assistant Modal Trigger */}
          <button
            onClick={() => setSentinelOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#0B1B3D] text-white hover:bg-[#162444] rounded text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs shrink-0"
            title="Open Sentinel Policy RAG Assistant"
          >
            <Cpu size={12} className="text-amber-400" />
            <span className="hidden sm:inline">Sentinel AI</span>
          </button>

          {/* Clock (hidden on mobile) */}
          <div className="hidden xl:block text-right">
            <p className="text-[11px] font-mono font-bold text-slate-800 tabular-nums leading-none">{time}</p>
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">{date}</p>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          {/* Notifications */}
          <button
            className="relative p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all rounded"
            aria-label="Notifications"
          >
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full" />
          </button>

          {/* ── End Session Button (Always visible on all screens) ── */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 rounded text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
            title="Terminate secure session"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">End Session</span>
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 hover:bg-slate-100 rounded transition-all"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <div className="w-6 h-6 bg-[#0B1B3D] rounded flex items-center justify-center shrink-0 text-white font-black text-xs">
                {roleToken[0]}
              </div>
              <ChevronDown size={10} className="text-slate-400 hidden sm:block" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-300 shadow-xl z-50 py-1 rounded-md">
                  <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider">[ROLE: {roleToken}]</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">BHOPAL_METRO_ZONE_01</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">TLS 1.3 SECURE TOKEN</p>
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

      {/* ── MOBILE SLIDE-DOWN DRAWER (lg:hidden) ─────────────────────────── */}
      {mobileNavOpen && (
        <div className="lg:hidden border-b border-slate-300 bg-slate-50 p-3 space-y-1 animate-fade-in shadow-inner">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest px-3 py-1">
            Navigation Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileNavOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-[#0B1B3D] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <span>{item.label}</span>
                {active && <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setSentinelOpen(true);
                setMobileNavOpen(false);
              }}
              className="w-full py-2 px-3 bg-[#0B1B3D] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center"
            >
              <Cpu size={14} className="text-amber-400" />
              <span>Open Sentinel AI Assistant</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 border border-red-200 bg-red-50 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center"
            >
              <LogOut size={14} />
              <span>End Authority Session</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Sentinel Assistant Modal Dialog ────────────────────────────── */}
      <SentinelAssistantModal
        isOpen={sentinelOpen}
        onClose={() => setSentinelOpen(false)}
      />

    </header>
  );
}
