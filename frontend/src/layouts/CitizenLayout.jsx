import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home, ClipboardList, Layers, BookOpen, Bell, User,
  Search, Shield, ChevronRight, Phone, Cloud
} from 'lucide-react';
import { APP_NAME } from '../utils/constants';
import UnityLogo from '../components/shared/UnityLogo';

const NAV_ITEMS = [
  { label: 'Home',     to: '/citizen/home',     icon: Home          },
  { label: 'Report',   to: '/citizen/report',   icon: ClipboardList },
  { label: 'Projects', to: '/citizen/projects', icon: Layers        },
  { label: 'Schemes',  to: '/citizen/schemes',  icon: BookOpen      },
  { label: 'Alerts',   to: '/citizen/notifications', icon: Bell     },
  { label: 'Profile',  to: '/citizen/profile',  icon: User          },
];

export default function CitizenLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* ─── LEFT SIDEBAR (Desktop) ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a1829] text-slate-300 border-r border-slate-800 shrink-0 relative">
        {/* Upper Brand Section */}
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

        {/* Sidebar Nav items */}
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

          {/* Scheme recommendation widget */}
          <div className="mt-6 bg-[#0e2136] border border-blue-900/40 rounded-xl p-3.5 space-y-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-wider leading-tight">
              Not sure which scheme fits you?
            </h4>
            <p className="text-[9px] text-slate-400 leading-normal">
              Answer a few questions and we'll suggest the best schemes for you.
            </p>
            <button className="w-full flex items-center justify-between bg-blue-900 hover:bg-blue-800 text-white text-[10px] font-bold px-3 py-2 rounded-lg transition-colors">
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
              <p className="text-[9px] text-slate-500 mt-1 leading-none">Mon-Sat, 9AM to 6PM</p>
            </div>
          </div>
        </nav>

        {/* Brand/Watermark Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#071321]/40 flex items-center gap-3">
          {/* Ashoka Pillar Seal SVG Mock */}
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

      {/* ─── MAIN APP AREA ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 gap-4 shrink-0 z-20">
          
          {/* Search schemes */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search schemes, benefits, eligibility..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
            />
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Weather */}
            <div className="flex items-center gap-2">
              <Cloud size={16} className="text-amber-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-800 leading-none">31°C</p>
                <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Bhopal</p>
              </div>
            </div>

            {/* Notification */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border border-white rounded-full text-[7px] text-white flex items-center justify-center font-bold">2</span>
            </button>

            {/* Profile badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <UnityLogo size={32} />
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-800 leading-none">Authorized Access</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">Executive Access</p>
              </div>
            </div>
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
