import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Shield, Landmark, GitBranch, BarChart3, Lock, MapPin,
  Building2, Users, Phone, Zap
} from 'lucide-react';
import heroBg from '../assets/bhopal_hero.png';
import UnityLogo from '../components/shared/UnityLogo';

// GIS Coordinates for Left Network Layout
const LOGIN_NODES = [
  { id: 'pwd',       name: 'PWD',       sub: 'Public Works Department',        x: 20, y: 25, Icon: Building2 },
  { id: 'revenue',   name: 'REVENUE',   sub: 'Department',                     x: 9,  y: 38, Icon: Landmark  },
  { id: 'transport', name: 'TRANSPORT', sub: 'Department',                     x: 10, y: 55, Icon: Users     },
  { id: 'phed',      name: 'PHED',      sub: 'Public Health Engineering Dept', x: 24, y: 58, Icon: Phone     },
  { id: 'mpeb',      name: 'MPEB',      sub: 'Madhya Pradesh Electricity Board',x: 15, y: 69, Icon: Zap       },
];

const LOGIN_CONNECTIONS = [
  { from: 'pwd',       to: 'revenue' },
  { from: 'revenue',   to: 'transport' },
  { from: 'transport', to: 'mpeb' },
  { from: 'mpeb',      to: 'phed' },
  { from: 'phed',      to: 'pwd' },
  { from: 'pwd',       to: 'transport' },
  { from: 'revenue',   to: 'phed' },
];

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col justify-between font-sans select-none bg-slate-950 text-slate-100 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <style>{`
        /* Global override styles for children components inside AuthLayout to force the dark glassmorphism design */
        .auth-container .card-class {
          background-color: rgba(12, 28, 56, 0.85) !important;
          border-color: rgba(30, 58, 138, 0.4) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6) !important;
          border-radius: 1rem !important;
          color: #ffffff !important;
          padding: 1.75rem !important;
          backdrop-filter: blur(12px) !important;
        }
        .auth-container label {
          color: #94a3b8 !important;
          font-size: 0.75rem !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          margin-bottom: 0.25rem !important;
        }
        .auth-container input {
          background-color: #070e1b !important;
          color: #ffffff !important;
          border-color: rgba(30, 58, 138, 0.4) !important;
          border-radius: 0.375rem !important;
          outline: none !important;
          transition: all 150ms ease-in-out !important;
        }
        .auth-container input:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25) !important;
        }
        .auth-container button {
          border-radius: 0.5rem !important;
          font-weight: 700 !important;
          transition: all 150ms ease-in-out !important;
        }
        .pulse-slow {
          animation: pulseSlow 3s infinite ease-in-out;
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.6); opacity: 0.75; }
        }
      `}</style>

      {/* Dark Slate Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/75 to-slate-950/95 z-0 pointer-events-none" />

      {/* ── TOP RIGHT PILOT ZONE BADGE ───────────────────────────────────────── */}
      <div className="absolute top-6 right-8 z-20 hidden md:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-md px-3 py-1.5 text-[11px] font-bold text-slate-300">
        <MapPin size={12} className="text-blue-500" />
        PILOT ZONE: <span className="text-blue-400 ml-0.5">BHOPAL</span>
      </div>

      {/* ── LEFT GIS NETWORK LAYER (Only on desktop screens) ─────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block">
        
        {/* Draw connection lines */}
        <svg className="w-full h-full absolute inset-0">
          {LOGIN_CONNECTIONS.map((conn, idx) => {
            const from = LOGIN_NODES.find(n => n.id === conn.from);
            const to = LOGIN_NODES.find(n => n.id === conn.to);
            if (!from || !to) return null;
            return (
              <line
                key={idx}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Draw Nodes */}
        {LOGIN_NODES.map((node) => {
          const NodeIcon = node.Icon;
          return (
            <div
              key={node.id}
              className="absolute"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Pulse */}
              <div className="absolute w-8 h-8 -left-4 -top-4 rounded-full bg-blue-500/10 border border-blue-400/20 pulse-slow" />
              
              {/* Label Group */}
              <div className="flex items-center gap-2.5 bg-slate-950/40 backdrop-blur-sm border border-slate-800/40 rounded-xl p-2 max-w-[180px]">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900/40 flex items-center justify-center shrink-0 text-blue-400">
                  <NodeIcon size={14} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-white leading-none">{node.name}</p>
                  <p className="text-[8px] text-slate-400 truncate mt-0.5 leading-none">{node.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── HEADER BRANDING ─────────────────────────────────────────────────── */}
      <div className="w-full text-center pt-8 md:pt-12 relative z-20 space-y-1">
        <UnityLogo size={48} className="mx-auto mb-2" />

        <h2 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter drop-shadow-md">
          UNITY
        </h2>
        <p className="text-xs text-white/70 font-semibold drop-shadow-sm">
          Government of Madhya Pradesh · Bhopal
        </p>
      </div>

      {/* ── MAIN CONTENT (CENTERED AUTH CARD) ───────────────────────────────── */}
      <main className="w-full flex-1 flex items-center justify-center px-4 py-8 relative z-20 auth-container">
        <div className="w-full max-w-[440px]">
          <Outlet />
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0b1320]/80 backdrop-blur-md border-t border-slate-800 text-white px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-5 shrink-0 z-20">
        
        {/* Left — Branding */}
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-slate-500" />
          <div>
            <p className="text-sm font-bold text-white leading-none">UNITY v2.5</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Madhya Pradesh Digital Governance Initiative</p>
          </div>
        </div>

        {/* Centre — Attributes */}
        <div className="flex items-center gap-8">
          {[
            { Icon: Shield,    title: 'Secure',      sub: 'End-to-End Encryption'  },
            { Icon: GitBranch, title: 'Integrated',  sub: 'Unified Departments'    },
            { Icon: BarChart3, title: 'Trusted',     sub: 'Government Platform'    },
          ].map(({ Icon: FIcon, title, sub }) => (
            <div key={title} className="flex items-center gap-2 text-xs">
              <FIcon size={14} className="text-slate-500 shrink-0" />
              <div>
                <p className="font-semibold text-slate-300 leading-none">{title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Access Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider leading-none">
              Restricted Access
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">· Authorized Personnel Only</p>
          </div>
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shrink-0">
            <Lock size={15} className="text-slate-400" />
          </div>
        </div>
      </footer>

    </div>
  );
}
