import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ROLES } from '../utils/constants';
import {
  Shield, Landmark, Building2, Users2, ArrowRight,
  MapPin, CheckCircle2, GitBranch, Users,
  BarChart3, Bell, PieChart, Map, Flag, BellRing, Lock,
} from 'lucide-react';
import heroBg from '../assets/bhopal_hero.png';
import UnityLogo from '../components/shared/UnityLogo';

// ─── Role Card Definitions ─────────────────────────────────────────────────────
const ROLES_DATA = [
  {
    id: 'authority',
    Icon: Landmark,
    iconBg:       'bg-blue-50',
    iconColor:    'text-blue-700',
    subtitle:     'OFFICIALS & ENGINEERS',
    subtitleColor:'text-blue-600',
    title:        'Government Authority',
    divider:      'bg-blue-600',
    description:  'For Collectors, Commissioners, Executive Engineers, and Line Department Officers to approve, track, and resolve inter-departmental dependencies.',
    route:        '/auth/login?role=authority',
    btnClass:     'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20',
    btnLabel:     'Access Workspace',
    tags: [
      { Icon: CheckCircle2, label: 'Approvals'     },
      { Icon: GitBranch,    label: 'Dependencies'  },
      { Icon: Users,        label: 'Coordination'  },
    ],
  },
  {
    id: 'command',
    Icon: BarChart3,
    iconBg:       'bg-slate-100',
    iconColor:    'text-slate-700',
    subtitle:     'MISSION MONITORING',
    subtitleColor:'text-slate-700',
    title:        'Nodal Command Centre',
    divider:      'bg-slate-800',
    description:  'For Nodal Officers and the Chief Secretariat to oversee city-wide department performance, review CRI heatmaps, and coordinate escalations.',
    route:        '/auth/login?role=command',
    btnClass:     'bg-slate-900 hover:bg-black text-white shadow-sm shadow-slate-900/30',
    btnLabel:     'Access Workspace',
    tags: [
      { Icon: BarChart3, label: 'Performance'  },
      { Icon: Bell,      label: 'Escalations'  },
      { Icon: PieChart,  label: 'Analytics'    },
    ],
  },
  {
    id: 'citizen',
    Icon: Users2,
    iconBg:       'bg-emerald-50',
    iconColor:    'text-emerald-600',
    subtitle:     'PUBLIC SERVICES',
    subtitleColor:'text-emerald-600',
    title:        'Citizen Portal',
    divider:      'bg-emerald-500',
    description:  'Public portal for Bhopal residents to track active project locations, review civic road closures, report localized issues, and check scheme eligibility.',
    route:        '/citizen/home',
    btnClass:     'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20',
    btnLabel:     'Enter Public Portal',
    tags: [
      { Icon: Map,     label: 'Track Projects' },
      { Icon: Flag,    label: 'Report Issues'  },
      { Icon: BellRing,label: 'Stay Informed'  },
    ],
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { isAuthenticated, getHomeRoute } = useAuthStore();

  if (isAuthenticated) {
    navigate(getHomeRoute(), { replace: true });
    return null;
  }

  function handleSelect(role) {
    navigate(role.route);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans select-none bg-slate-900">

      {/* ── TOP HEADER ───────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-30 relative">
        <div className="flex items-center gap-3">
          <UnityLogo size={36} />
          <div>
            <h1 className="text-xs font-black tracking-widest text-slate-900 uppercase leading-none">
              Government of Madhya Pradesh
            </h1>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              State IT Infrastructure Coordination Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border border-slate-300 rounded-md px-3 py-1.5 text-[11px] font-bold text-slate-700">
          <MapPin size={12} className="text-blue-600" />
          PILOT ZONE: <span className="text-blue-700 ml-1">BHOPAL</span>
        </div>
      </header>

      {/* ── MAIN CONTENT WITH FULL IMAGE BACKGROUND ────────────────────────── */}
      <main
        className="flex-1 bg-cover bg-center relative flex flex-col justify-between p-6 md:p-8"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark blue-slate gradient overlay covering the entire main container background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-950/90 z-0" />

        {/* Outer relative wrapper to put content above the overlay */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center gap-6 md:gap-8">

          {/* Hero Branding Info */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-full border border-white/15 shadow-md uppercase tracking-widest mx-auto">
              <Shield size={11} className="text-blue-400" />
              Secure Intra-Net Gateway
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter drop-shadow-lg">
              UNITY
            </h2>

            <p className="text-base md:text-lg font-bold text-white drop-shadow-md tracking-wide">
              Unified Network for Interdepartmental Transparency and Yield
            </p>
            <div className="w-16 h-0.5 bg-teal-400 rounded-full mx-auto" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES_DATA.map((role) => {
              const { Icon } = role;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelect(role)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(role)}
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex flex-col p-6 gap-4 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 group"
                >
                  {/* Card Icon */}
                  <div className={`w-12 h-12 ${role.iconBg} rounded-xl flex items-center justify-center shrink-0 ${role.iconColor}`}>
                    <Icon size={22} />
                  </div>

                  {/* Subtitle & Title */}
                  <div>
                    <p className={`text-[10px] font-extrabold uppercase tracking-widest ${role.subtitleColor} mb-1`}>
                      {role.subtitle}
                    </p>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                      {role.title}
                    </h3>
                    <div className={`w-8 h-0.5 ${role.divider} rounded-full mt-2`} />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed font-normal flex-1">
                    {role.description}
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelect(role); }}
                    className={`w-full py-3 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 ${role.btnClass}`}
                  >
                    {role.btnLabel}
                    <ArrowRight size={15} />
                  </button>

                  {/* Feature Tags */}
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                    {role.tags.map(({ Icon: TagIcon, label }) => (
                      <span key={label} className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <TagIcon size={10} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0b1320] border-t border-slate-800 text-white px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-5 shrink-0 z-10">

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
            { Icon: BarChart3, title: 'Intelligent', sub: 'AI-Powered Insights'    },
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
              RESTRICTED GATEWAY ACCESS
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
