import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  Shield, Landmark, Users2, ArrowRight,
  MapPin, CheckCircle2, GitBranch, Users,
  BarChart3, Bell, PieChart, Map, Flag, BellRing, Lock, LogOut, Check
} from 'lucide-react';
import heroBg from '../assets/bhopal_hero.png';
import UnityLogo from '../components/shared/UnityLogo';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, getHomeRoute, logout, loginAsRole } = useAuthStore();

  const handleInstantLogin = (roleName, targetPath) => {
    loginAsRole(roleName);
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-none bg-slate-900">

      {/* ── TOP HEADER ───────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 z-30 relative">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <UnityLogo size={32} />
          <div>
            <h1 className="text-[11px] sm:text-xs font-black tracking-widest text-slate-900 uppercase leading-none">
              Government of Madhya Pradesh
            </h1>
            <p className="text-[8px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              State IT Infrastructure Coordination Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border border-slate-300 rounded-md px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-slate-700">
          <MapPin size={11} className="text-blue-600" />
          <span className="hidden sm:inline">PILOT ZONE:</span> <span className="text-blue-700 font-black">BHOPAL</span>
        </div>
      </header>

      {/* ── MAIN CONTENT WITH IMAGE BACKGROUND ─────────────────────────────── */}
      <main
        className="flex-1 bg-cover bg-center relative flex flex-col justify-between p-4 sm:p-6 md:p-8"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-950/95 z-0" />

        {/* Content container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center gap-6 my-auto">

          {/* Active Session Notification (if user pressed back from an active session) */}
          {isAuthenticated && user && (
            <div className="bg-[#0B1B3D]/90 border border-blue-400/30 backdrop-blur-md rounded-xl p-3 sm:p-4 max-w-xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-white shadow-xl animate-fade-in">
              <div className="flex items-center gap-2.5 text-center sm:text-left">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-bold leading-tight">
                    Active Session: <span className="text-blue-300">{user.name}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Role: {user.role?.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate(getHomeRoute())}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Resume
                </button>
                <button
                  onClick={() => logout()}
                  className="px-3 py-1.5 border border-red-500/40 text-red-300 hover:bg-red-950/40 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <LogOut size={11} />
                  <span>Exit</span>
                </button>
              </div>
            </div>
          )}

          {/* Hero Branding Info */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full border border-white/15 shadow-md uppercase tracking-widest mx-auto">
              <Shield size={11} className="text-blue-400" />
              Secure Intra-Net Gateway
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none tracking-tighter drop-shadow-lg">
              UNITY
            </h2>

            <p className="text-sm sm:text-base md:text-lg font-bold text-white drop-shadow-md tracking-wide px-2">
              Unified Network for Interdepartmental Transparency and Yield
            </p>
            <div className="w-16 h-0.5 bg-teal-400 rounded-full mx-auto" />
          </div>

          {/* Cards Grid — Responsive 1 col on mobile, 3 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

            {/* ── CARD 1: Government Authority ── */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex flex-col p-5 sm:p-6 gap-3.5 hover:shadow-2xl transition-all duration-200">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-700">
                <Landmark size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">
                  OFFICIALS &amp; ENGINEERS
                </p>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Government Authority
                </h3>
                <div className="w-8 h-0.5 bg-blue-600 rounded-full mt-1.5" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                For Collectors, Commissioners, PWD Engineers, and Line Department Officers to monitor dependencies, clear C-Locks, and resolve blockers.
              </p>

              {/* Instant 1-Click Evaluation Access */}
              <button
                onClick={() => handleInstantLogin('collector', '/authority/dashboard')}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                <span>Instant Access (Collector)</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigate('/auth/login?role=authority')}
                className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider py-1"
              >
                Sign In with Credentials →
              </button>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Approvals</span>
                <span className="flex items-center gap-1"><GitBranch size={10} /> C-Lock</span>
                <span className="flex items-center gap-1"><Users size={10} /> Directives</span>
              </div>
            </div>

            {/* ── CARD 2: Nodal Command Centre ── */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex flex-col p-5 sm:p-6 gap-3.5 hover:shadow-2xl transition-all duration-200">
              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 text-slate-700">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 mb-0.5">
                  MISSION MONITORING
                </p>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Nodal Command Centre
                </h3>
                <div className="w-8 h-0.5 bg-slate-800 rounded-full mt-1.5" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                For Nodal Officers and the Chief Secretariat to oversee city-wide department performance, review CRI heatmaps, and coordinate escalations.
              </p>

              {/* Instant 1-Click Evaluation Access */}
              <button
                onClick={() => handleInstantLogin('nodal_officer', '/command/overview')}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white shadow-sm transition-all"
              >
                <span>Instant Access (Nodal Officer)</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigate('/auth/login?role=command')}
                className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider py-1"
              >
                Sign In with Credentials →
              </button>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><BarChart3 size={10} /> Heatmaps</span>
                <span className="flex items-center gap-1"><Bell size={10} /> Escalations</span>
                <span className="flex items-center gap-1"><PieChart size={10} /> Analytics</span>
              </div>
            </div>

            {/* ── CARD 3: Citizen Portal ── */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex flex-col p-5 sm:p-6 gap-3.5 hover:shadow-2xl transition-all duration-200">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                <Users2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-0.5">
                  PUBLIC SERVICES (9 DOMAINS)
                </p>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Citizen Portal
                </h3>
                <div className="w-8 h-0.5 bg-emerald-500 rounded-full mt-1.5" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                Public access for Bhopal residents to file OCR grievances, verify welfare scheme eligibility, track civic projects, and monitor healthcare/mandi services.
              </p>

              {/* Direct Access */}
              <button
                onClick={() => navigate('/citizen/home')}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              >
                <span>Enter Public Portal</span>
                <ArrowRight size={14} />
              </button>

              <p className="w-full text-center text-[10px] font-bold text-emerald-700 uppercase tracking-wider py-1">
                ✓ Public Access · No Sign-In Required
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Map size={10} /> Projects</span>
                <span className="flex items-center gap-1"><Flag size={10} /> Grievances</span>
                <span className="flex items-center gap-1"><BellRing size={10} /> Schemes</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0b1320] border-t border-slate-800 text-white px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-10 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <Shield size={18} className="text-slate-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white leading-none">UNITY v2.5 · State Coordination Platform</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Government of Madhya Pradesh Digital Initiative</p>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-mono">
          <span>SECURED CONNECT · BHOPAL METRO ZONE</span>
        </div>
      </footer>

    </div>
  );
}
