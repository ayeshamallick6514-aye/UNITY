import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ClipboardList, Layers, BookOpen, Bell, User,
  Search, ChevronRight, Phone, Cloud, LogOut,
} from 'lucide-react';
import { APP_NAME } from '../utils/constants';
import UnityLogo from '../components/shared/UnityLogo';
import useAuthStore from '../store/authStore';
import SchemeEligibilityQuiz from '../components/citizen/SchemeEligibilityQuiz';

const NAV_ITEMS = [
  { label: 'Home',     to: '/citizen/home',          icon: Home          },
  { label: 'Report',   to: '/citizen/report',        icon: ClipboardList },
  { label: 'Projects', to: '/citizen/projects',      icon: Layers        },
  { label: 'Schemes',  to: '/citizen/schemes',       icon: BookOpen      },
  { label: 'Alerts',   to: '/citizen/notifications', icon: Bell          },
  { label: 'Profile',  to: '/citizen/profile',       icon: User          },
];

export default function CitizenLayout() {
  const location                 = useLocation();
  const navigate                 = useNavigate();
  const { logout }               = useAuthStore();
  const [temp, setTemp]          = useState(null);
  const [quizOpen, setQuizOpen]  = useState(false);

  function handleLogout() {
    logout();
    navigate('/select-role', { replace: true });
  }

  // Live Bhopal temperature — Open-Meteo (free, no API key needed)
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current_weather=true')
      .then(r => r.json())
      .then(d => setTemp(Math.round(d?.current_weather?.temperature ?? 31)))
      .catch(() => setTemp(31));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">

      {/* ─── Scheme Eligibility Quiz Modal ───────────────────────── */}
      {quizOpen && <SchemeEligibilityQuiz onClose={() => setQuizOpen(false)} />}

      {/* ─── LEFT SIDEBAR (Desktop) ──────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a1829] text-slate-300 border-r border-slate-800 shrink-0 relative">

        {/* Brand */}
        <div className="flex items-center h-16 px-5 border-b border-slate-800 bg-[#071321]">
          <div className="flex items-center gap-2.5">
            <UnityLogo size={32} />
            <div>
              <p className="text-white font-extrabold text-xs tracking-wider uppercase leading-none">
                {APP_NAME}
              </p>
              <p className="text-slate-500 text-[9px] font-mono tracking-widest uppercase mt-1 leading-none">
                Citizens – Bhopal
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto dark-scroll">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all border border-transparent ${
                  isActive
                    ? 'bg-blue-950 text-white border-blue-900/50 shadow-inner'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`
              }
            >
              <item.icon size={15} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Scheme recommendation widget — opens quiz modal */}
          <div className="mt-6 bg-[#0e2136] border border-blue-900/40 rounded-xl p-3.5 space-y-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-wider leading-tight">
              Not sure which scheme fits you?
            </h4>
            <p className="text-[9px] text-slate-400 leading-normal">
              Answer 4 quick questions — we'll suggest the best schemes for you.
            </p>
            <button
              onClick={() => setQuizOpen(true)}
              className="w-full flex items-center justify-between bg-blue-900 hover:bg-blue-800 text-white text-[10px] font-bold px-3 py-2 rounded-lg transition-colors"
            >
              <span>Find My Schemes</span>
              <ChevronRight size={11} />
            </button>
          </div>

          {/* Help Line Widget */}
          <div className="mt-4 bg-[#0a1829] border border-slate-800 rounded-xl p-3 flex items-start gap-2.5">
            <Phone size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-black text-white uppercase tracking-wider leading-none">Need Help?</p>
              <p className="text-[10px] text-slate-300 font-bold mt-1 leading-none">Call 181 (Toll Free)</p>
              <p className="text-[9px] text-slate-500 mt-1 leading-none">Mon–Sat, 9AM to 6PM</p>
            </div>
          </div>
        </nav>

        {/* Logout — sidebar bottom */}
        <button
          onClick={handleLogout}
          className="mx-3 mb-2 flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold border border-red-900/30 text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
        >
          <LogOut size={14} className="shrink-0" />
          <span>End Session</span>
        </button>

        {/* Brand/Watermark Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#071321]/40 flex items-center gap-3">
          <svg className="w-8 h-8 text-slate-500 shrink-0" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 50 15 L 50 85 M 35 30 L 65 30 M 30 50 L 70 50 M 35 70 L 65 70" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="40" r="6" />
          </svg>
          <div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider leading-none">Government of</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1 leading-none">Madhya Pradesh</p>
          </div>
        </div>
      </aside>

      {/* ─── MAIN APP AREA ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 gap-4 shrink-0 z-20">

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search schemes, benefits, eligibility..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
            />
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-4 shrink-0">

            {/* Live weather — Bhopal */}
            <div className="flex items-center gap-2">
              <Cloud size={16} className="text-amber-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-800 leading-none tabular-nums">
                  {temp !== null ? `${temp}°C` : '--°C'}
                </p>
                <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Bhopal</p>
              </div>
            </div>

            {/* Notification */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border border-white rounded-full text-[7px] text-white flex items-center justify-center font-bold">
                2
              </span>
            </button>

            {/* Profile badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <UnityLogo size={32} />
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-800 leading-none">Authorized Access</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">Citizen Portal</p>
              </div>
            </div>

            {/* Sign Out — top header */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
              title="End session"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
