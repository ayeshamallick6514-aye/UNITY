import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import UnityMap from '../../components/map/UnityMap';
import heroBg from '../../assets/bhopal_hero.png';
import {
  Flag, AlertTriangle, Users, Shield, TrendingUp, ArrowRight,
  Calendar, Cloud, Flame, BarChart2, Building2, Radio,
  CheckCircle2, Clock, Expand, Cpu, ChevronRight, Zap
} from 'lucide-react';

// ─── Static Data ──────────────────────────────────────────────────────────────

const PRIORITIES = [
  {
    level: 'CRITICAL',
    labelClass: 'bg-red-600 text-white',
    exposure: '₹14.5 Cr',
    borderClass: 'border-l-[3px] border-l-red-500',
    title: 'MP Nagar Widening',
    blockedBy: 'Revenue Department',
    desc: 'PWD road works completely halted. Land acquisition compensation sign-offs pending for 47 days at Carmel Convent zone.',
    footer: 'Friday Penalty Trigger',
    footerColor: 'text-red-500',
    route: '/authority/projects',
  },
  {
    level: 'HIGH PRIORITY',
    labelClass: 'bg-amber-500 text-white',
    exposure: '₹3.5 Cr',
    borderClass: 'border-l-[3px] border-l-amber-400',
    title: 'AIIMS Pipeline Upgrade',
    blockedBy: 'Water Supply Department',
    desc: 'Excavation blocked. Awaiting mandatory water supply shutdown permit and coordination clearances for the AIIMS corridor.',
    footer: '8 Days Idle Burn',
    footerColor: 'text-amber-500',
    route: '/authority/projects',
  },
  {
    level: 'MEDIUM PRIORITY',
    labelClass: 'bg-blue-500 text-white',
    exposure: '₹5.2 Cr',
    borderClass: 'border-l-[3px] border-l-blue-400',
    title: 'Kolar Utility Relocation',
    blockedBy: 'Energy Department',
    desc: 'Energy Dept poles relocation pending, blocking storm-drain layout. Traffic Cell relocation permit cleared.',
    footer: '19 Days Stalled',
    footerColor: 'text-blue-500',
    route: '/authority/projects',
  },
];

const NOC_ROWS = [
  { project: 'AIIMS Corridor Development', from: 'Water Supply', to: 'PWD',     stage: 'AWAITING',  age: 6, stageColor: 'text-amber-600 bg-amber-50 border-amber-200' },
  { project: 'Smart Road Package 2',       from: 'Energy',       to: 'Traffic', stage: 'AWAITING',  age: 4, stageColor: 'text-amber-600 bg-amber-50 border-amber-200' },
  { project: 'VIP Road Drainage Network',  from: 'PWD',          to: 'Revenue', stage: 'IN REVIEW', age: 3, stageColor: 'text-blue-600 bg-blue-50 border-blue-200'   },
];

const CITIZEN_REPORTS = [
  { id: 'r1', title: 'Pothole on Kolar Road', loc: 'Kolar Road, Bhopal', time: '12 min ago', status: 'VERIFIED',            statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200', img: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=60&auto=format&fit=crop&q=60' },
  { id: 'r2', title: 'Water Leakage',         loc: 'Arera Hills',        time: '18 min ago', status: 'INSPECTION ASSIGNED', statusColor: 'text-blue-600 bg-blue-50 border-blue-200',           img: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=60&auto=format&fit=crop&q=60' },
  { id: 'r3', title: 'Illegal Excavation',    loc: 'MP Nagar Zone 1',    time: '32 min ago', status: 'SENT TO PWD',         statusColor: 'text-slate-600 bg-slate-100 border-slate-200',        img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=60&auto=format&fit=crop&q=60' },
];

// ─── CRI Gauge ────────────────────────────────────────────────────────────────
function CRIGauge({ value = 87 }) {
  const radius = 36;
  const circumference = Math.PI * radius; // half circle
  const pct = Math.min(Math.max(value, 0), 100) / 100;
  const offset = circumference * (1 - pct);
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <svg width="90" height="50" viewBox="0 0 90 50">
        {/* Track */}
        <path
          d="M 8 46 A 36 36 0 0 1 82 46"
          fill="none" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d="M 8 46 A 36 36 0 0 1 82 46"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="text-2xl font-black text-slate-900 -mt-3">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [syncTime, setSyncTime] = useState('');

  useEffect(() => {
    const now = new Date();
    setSyncTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }));
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-50 font-sans text-slate-800">

      {/* ── HERO HEADER BANNER ─────────────────────────────────────────────── */}
      <div
        className="relative bg-cover bg-center shrink-0"
        style={{ backgroundImage: `url(${heroBg})`, minHeight: '110px' }}
      >
        <div className="absolute inset-0 bg-[#0d1e3d]/70 z-0" />
        <div className="relative z-10 px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest leading-none">
              District Operations Center
            </h2>
            <p className="text-[11px] text-slate-300 font-semibold mt-1 tracking-wide">
              Executive Dashboard &nbsp;·&nbsp; Bhopal District, Madhya Pradesh
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-[10px] text-white font-bold shrink-0">
            <Calendar size={11} className="text-slate-300" />
            Last Sync: {syncTime || '--:--'} pm
          </div>
        </div>

        {/* ── KPI STRIP — positioned overlapping the banner bottom ── */}
        <div className="relative z-10 px-4 pb-0 -mb-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-7xl mx-auto">

            {/* Active Missions */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Active Missions</p>
                <p className="text-3xl font-black text-slate-900 mt-1 leading-none">74</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                  <TrendingUp size={10} />+8 since yesterday
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                <Flag size={16} />
              </div>
            </div>

            {/* Critical Interlocks */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Critical Interlocks</p>
                <p className="text-3xl font-black text-red-600 mt-1 leading-none">3</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Require immediate attention</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
                <AlertTriangle size={16} />
              </div>
            </div>

            {/* Citizen Reports */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Citizen Reports</p>
                <p className="text-3xl font-black text-slate-900 mt-1 leading-none">8</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Awaiting validation</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                <Users size={16} />
              </div>
            </div>

            {/* Sentinel Status */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Sentinel Status</p>
                <p className="text-base font-black text-emerald-600 mt-1 leading-tight">OPERATIONAL</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">AI Engine Online</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                <Shield size={16} />
              </div>
            </div>

            {/* CRI Gauge */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Coordination Readiness (CRI)</p>
                <CRIGauge value={87} />
                <p className="text-[10px] text-emerald-600 font-bold text-center -mt-1">High Performance</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                <BarChart2 size={16} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── BODY — starts after KPI card overlap ─────────────────────────────── */}
      <div className="flex-1 px-4 pt-20 pb-4 max-w-7xl mx-auto w-full space-y-4">

        {/* ── ROW 1: Priorities + Map ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Priorities - 8 cols */}
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Today's Core Priorities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRIORITIES.map((p) => (
                <div key={p.title} className={`bg-white rounded-xl shadow-sm border border-slate-100 ${p.borderClass} flex flex-col`}>
                  <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${p.labelClass}`}>
                      {p.level}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">Exposure: {p.exposure}</span>
                  </div>
                  <div className="px-4 pb-2 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{p.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Blocked by: {p.blockedBy}</p>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-xl">
                    <span className={`text-[10px] font-bold ${p.footerColor}`}>{p.footer}</span>
                    <button
                      onClick={() => navigate(p.route)}
                      className="flex items-center gap-0.5 text-[10px] font-bold text-blue-900 hover:underline"
                    >
                      View Details <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map - 4 cols */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bhopal Operations Map</h3>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <Expand size={13} />
              </button>
            </div>
            <div className="h-48 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
              <UnityMap activeLayers={['road_projects', 'road_closures']} />
            </div>
            {/* Map Legend */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { dot: 'bg-red-500',    label: 'Critical' },
                { dot: 'bg-amber-500',  label: 'High'     },
                { dot: 'bg-blue-400',   label: 'Medium'   },
                { dot: 'bg-emerald-500',label: 'Normal'   },
              ].map(({ dot, label }) => (
                <span key={label} className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ── ROW 2: NOC Table + Sentinel + Citizen Reports ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* NOC Table — 5 cols */}
          <div className="lg:col-span-5 space-y-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Inter-Departmental NOCs</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-4 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-wider">Project / Work Package</th>
                    <th className="px-2 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-wider">From</th>
                    <th className="px-2 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-wider">To</th>
                    <th className="px-2 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-wider">Stage</th>
                    <th className="px-2 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-wider">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {NOC_ROWS.map((row) => (
                    <tr key={row.project} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-slate-800 text-[11px] leading-tight max-w-[150px]">{row.project}</td>
                      <td className="px-2 py-2.5 text-slate-500 text-[10px]">{row.from}</td>
                      <td className="px-2 py-2.5 text-slate-500 text-[10px]">{row.to}</td>
                      <td className="px-2 py-2.5">
                        <span className={`text-[9px] font-black border px-1.5 py-0.5 rounded uppercase tracking-widest ${row.stageColor}`}>
                          {row.stage}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-slate-400 text-[10px] font-mono">{row.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2.5 border-t border-slate-100">
                <button
                  onClick={() => navigate('/authority/coordination')}
                  className="text-[10px] font-bold text-blue-900 hover:underline flex items-center gap-0.5"
                >
                  View All Interlocks <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Sentinel AI Recommendation — 4 cols */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">UNITY Sentinel Recommendation</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3 h-[calc(100%-24px)]">
              
              {/* AI Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-900/30 flex items-center justify-center shrink-0 text-blue-400">
                  <Cpu size={18} />
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                  Revenue Department approval delay is blocking three downstream projects.
                </p>
              </div>

              {/* Recommended Action */}
              <div className="bg-slate-50 rounded-lg p-3 space-y-1 border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Action</p>
                <p className="text-[11px] text-slate-700 font-medium">
                  Issue joint clearance meeting within 48 hours.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
                  <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Potential Saving</p>
                  <p className="text-lg font-black text-emerald-700 leading-tight mt-0.5">₹41 Lakh</p>
                </div>
                <div className="border border-slate-100 rounded-lg p-3 text-center flex flex-col items-center gap-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                      <circle cx="20" cy="20" r="16" fill="none" stroke="#22c55e" strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 16 * 0.94} ${2 * Math.PI * 16}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[10px] font-black text-slate-800">94%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/authority/brief')}
                className="w-full text-center text-[10px] font-bold text-blue-900 hover:underline flex items-center justify-center gap-0.5"
              >
                View Full Analysis <ArrowRight size={11} />
              </button>
            </div>
          </div>

          {/* Citizen Reports — 3 cols */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Citizen Reports</h3>
              <button className="text-[10px] font-bold text-blue-900 hover:underline">View All →</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100%-24px)]">
              {CITIZEN_REPORTS.map((r, idx) => (
                <div key={r.id} className={`flex items-center gap-3 p-3 ${idx < CITIZEN_REPORTS.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <img src={r.img} alt={r.title} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 leading-none truncate">{r.title}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 truncate">{r.loc}</p>
                    <span className={`text-[8px] font-black border px-1 py-0.5 rounded uppercase tracking-widest mt-1 inline-block ${r.statusColor}`}>
                      {r.status}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-300 font-mono shrink-0 text-right">{r.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── BOTTOM STATUS BAR ───────────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center gap-6 text-xs shrink-0 overflow-x-auto">

        {/* Weather */}
        <div className="flex items-center gap-2 shrink-0">
          <Cloud size={16} className="text-slate-400" />
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Weather</p>
            <p className="font-bold text-slate-800 text-sm leading-tight">31°C</p>
            <p className="text-[9px] text-slate-400 leading-none">Rain Expected &nbsp;<span className="text-amber-600 font-bold">Work Risk: High</span></p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-200 shrink-0" />

        {/* Daily Burn */}
        <div className="flex items-center gap-2 shrink-0">
          <Flame size={16} className="text-slate-400" />
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Daily Burn</p>
            <p className="font-bold text-slate-800 text-sm leading-tight">₹1,45,000</p>
            <p className="text-[9px] text-red-500 font-bold leading-none">▲ ₹12,000 vs yesterday</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-200 shrink-0" />

        {/* Active Departments */}
        <div className="flex items-center gap-2 shrink-0">
          <Building2 size={16} className="text-slate-400" />
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Active Departments</p>
            <p className="font-bold text-slate-800 text-sm leading-tight">18 / 24</p>
            <p className="text-[9px] text-slate-400 leading-none">75% Operational</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-200 shrink-0" />

        {/* Emergency Broadcast */}
        <div className="flex items-center gap-2 shrink-0">
          <Radio size={16} className="text-slate-400" />
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Emergency Broadcast</p>
            <p className="font-bold text-emerald-600 text-sm leading-tight">No Active Alerts</p>
            <p className="text-[9px] text-slate-400 leading-none">All Clear</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-200 shrink-0" />

        {/* System Health */}
        <div className="flex items-center gap-2 shrink-0">
          <Shield size={16} className="text-slate-400" />
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">System Health</p>
            <p className="font-bold text-emerald-600 text-sm leading-tight">All Systems Operational</p>
            <p className="text-[9px] text-slate-400 leading-none">Uptime 99.94%</p>
          </div>
        </div>

      </div>

    </div>
  );
}
