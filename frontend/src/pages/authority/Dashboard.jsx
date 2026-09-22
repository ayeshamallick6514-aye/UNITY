import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import UnityMap from '../../components/map/UnityMap';
import {
  AlertTriangle, Users, Shield, TrendingUp, ArrowRight,
  Cpu, Expand, Cloud, Flame, Building2, Radio,
  Flag, Activity, ChevronRight,
} from 'lucide-react';

// ─── Static Interlock Data (Bhopal-verified agencies) ────────────────────────

const INTERLOCKS = [
  {
    id: 'IL-BPL-001',
    primary:   'MP Public Works Dept. (PWD)',
    conflict:  'Revenue Department, GoMP',
    location:  'MP Nagar, Ward 42',
    delayCost: '₹14.5 Cr',
    stage:     'PENALTY_IMMINENT',
    stageColor:'text-red-700 bg-red-50 border-red-300',
    status:    'CRITICAL',
    statusColor:'bg-red-600',
    desc:      'Land acquisition compensation sign-offs pending 47 days. Carmel Convent zone clearance blocked.',
  },
  {
    id: 'IL-BPL-002',
    primary:   'Bhopal Smart City Dev. Corp.',
    conflict:  'MP Poorv Kshetra Vidyut Vitaran',
    location:  'AIIMS Corridor, Ward 28',
    delayCost: '₹3.5 Cr',
    stage:     'AWAITING_NOC',
    stageColor:'text-amber-700 bg-amber-50 border-amber-300',
    status:    'HIGH',
    statusColor:'bg-amber-500',
    desc:      'Excavation halted. Mandatory utility shutdown permit and dual-circuit coordination pending.',
  },
  {
    id: 'IL-BPL-003',
    primary:   'Bhopal Municipal Corporation',
    conflict:  'MP Poorv Kshetra Vidyut Vitaran',
    location:  'Kolar Road, Ward 55',
    delayCost: '₹5.2 Cr',
    stage:     'IN_REVIEW',
    stageColor:'text-blue-700 bg-blue-50 border-blue-300',
    status:    'MEDIUM',
    statusColor:'bg-blue-500',
    desc:      'Electricity board pole relocation blocking storm-drain layout. 19 days stalled.',
  },
  {
    id: 'IL-BPL-004',
    primary:   'MP Water Resources Department',
    conflict:  'Traffic Police, Bhopal City',
    location:  'VIP Road, Ward 11',
    delayCost: '₹2.1 Cr',
    stage:     'ESCALATED',
    stageColor:'text-red-700 bg-red-50 border-red-300',
    status:    'HIGH',
    statusColor:'bg-amber-500',
    desc:      'Water main diversion requires road closure permit. Escalated to Collector level.',
  },
  {
    id: 'IL-BPL-005',
    primary:   'Smart Road Package II — BMC',
    conflict:  'Traffic Police, Bhopal City',
    location:  'DB Mall Junction, Ward 19',
    delayCost: '₹1.8 Cr',
    stage:     'AWAITING_NOC',
    stageColor:'text-amber-700 bg-amber-50 border-amber-300',
    status:    'MEDIUM',
    statusColor:'bg-blue-500',
    desc:      'Traffic diversion plan under police review. Expected clearance in 4 days.',
  },
];

const MAP_LEGEND = [
  { color: 'bg-red-600',     label: 'Critical Interlock' },
  { color: 'bg-amber-500',   label: 'High Priority'      },
  { color: 'bg-blue-500',    label: 'Under Review'       },
  { color: 'bg-emerald-600', label: 'Cleared / Active'   },
];

// ─── Telemetry Ribbon Data ────────────────────────────────────────────────────

const TELEMETRY = [
  {
    code: 'WORK_PKGS',
    label: 'Active Work Packages',
    value: '74',
    unit: 'ACTIVE',
    sub: '+8 since 0800 hrs',
    subColor: 'text-emerald-700',
    borderColor: 'border-l-slate-400',
    icon: Flag,
  },
  {
    code: 'SPATIAL_LOCK',
    label: 'Critical Spatial Interlocks',
    value: '3',
    unit: 'SEVERE',
    sub: 'Require immediate executive action',
    subColor: 'text-red-700',
    borderColor: 'border-l-red-600',
    valueCls: 'text-red-700',
    icon: AlertTriangle,
  },
  {
    code: 'GRIEVANCES',
    label: 'Unresolved Citizen Grievances',
    value: '8',
    unit: 'PENDING',
    sub: 'Awaiting field validation',
    subColor: 'text-slate-500',
    borderColor: 'border-l-amber-500',
    icon: Users,
  },
  {
    code: 'SENTINEL',
    label: 'Sentinel Predictive Engine',
    value: 'RAG_ACTIVE',
    unit: 'CONFIDENCE: 94.2%',
    sub: 'Policy inference operational',
    subColor: 'text-emerald-700',
    borderColor: 'border-l-emerald-600',
    valueCls: 'text-emerald-700 text-base font-black',
    icon: Cpu,
  },
  {
    code: 'CRI',
    label: 'Coordination Readiness Index',
    value: '87.4',
    unit: '/ 100',
    sub: 'High Performance Band',
    subColor: 'text-emerald-700',
    borderColor: 'border-l-emerald-600',
    icon: Activity,
  },
];

// ─── Status Footer Data ───────────────────────────────────────────────────────

const STATUS_ITEMS = [
  { Icon: Cloud,    label: 'Field Conditions',  value: '31°C Monsoon',  sub: 'Work Risk: HIGH',  subColor: 'text-amber-700'   },
  { Icon: Flame,    label: 'Daily Idle Burn',   value: '₹1,45,000',    sub: '▲ ₹12,000 vs T-1', subColor: 'text-red-600'     },
  { Icon: Building2,label: 'Depts. Online',     value: '18 / 24',      sub: '75% Operational',  subColor: 'text-slate-500'   },
  { Icon: Radio,    label: 'Emerg. Broadcast',  value: 'NIL ACTIVE',   sub: 'Situation Normal', subColor: 'text-emerald-700' },
  { Icon: Shield,   label: 'System Health',     value: 'OPERATIONAL',  sub: 'Uptime: 99.94%',   subColor: 'text-emerald-700' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
  const [syncTs,  setSyncTs]  = useState('');

  useEffect(() => {
    const now = new Date();
    setSyncTs(
      now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Asia/Kolkata',
      }) + ' IST'
    );
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-100 text-slate-900 font-sans">

      {/* ── EXECUTIVE HEADER BAND ──────────────────────────────────────────── */}
      <div className="bg-[#0B1B3D] px-6 py-3 flex items-center justify-between shrink-0 border-b border-[#162444]">
        <div>
          <h2 className="text-[13px] font-black text-white uppercase tracking-[0.2em] leading-none">
            District Operations Command
          </h2>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-wider mt-1">
            Executive Authority Dashboard&nbsp;·&nbsp;BHOPAL METRO ZONE 01&nbsp;·&nbsp;MPOnline PS-5
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
            Last Sync:&nbsp;
          </span>
          <span className="text-[10px] font-mono font-bold text-amber-400 tabular-nums">
            {syncTs || '--:--:-- IST'}
          </span>
        </div>
      </div>

      {/* ── TELEMETRY RIBBON ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-300 px-4 py-0 shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-200">
          {TELEMETRY.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.code}
                className={`px-5 py-3 flex items-start gap-3 border-l-[3px] ${t.borderColor} bg-white hover:bg-slate-50 transition-colors`}
              >
                <Icon size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest leading-none truncate">
                    {t.label}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-xl font-black leading-none tabular-nums ${t.valueCls || 'text-slate-900'}`}>
                      {t.value}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t.unit}</span>
                  </div>
                  <p className={`text-[9px] font-semibold mt-0.5 ${t.subColor}`}>{t.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CORE BODY ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">

          {/* ── LEFT PANEL: Interlocks Table (60%) ─────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden border-r border-slate-300">

            {/* Panel Header */}
            <div className="bg-white border-b border-slate-300 px-5 py-2.5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.18em]">
                  Active Interdepartmental Interlocks
                </h3>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                  {INTERLOCKS.length} work packages flagged&nbsp;·&nbsp;Real-time dependency feed
                </p>
              </div>
              <button
                onClick={() => navigate('/authority/coordination')}
                className="flex items-center gap-1 text-[10px] font-bold text-[#0B1B3D] border border-[#0B1B3D] px-3 py-1.5 hover:bg-[#0B1B3D] hover:text-white transition-all uppercase tracking-wider"
              >
                View All <ArrowRight size={11} />
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto bg-white">
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-100 border-b-2 border-slate-300">
                    {[
                      'Interlock ID',
                      'Primary Agency',
                      'Conflicting Agency',
                      'Location (Ward)',
                      'Est. Delay Cost',
                      'Escalation Stage',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[8.5px] font-black uppercase tracking-wider text-slate-700 whitespace-nowrap border-r border-slate-200 last:border-r-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INTERLOCKS.map((il, idx) => (
                    <tr
                      key={il.id}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                      onClick={() => navigate('/authority/coordination')}
                    >
                      {/* Interlock ID */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <span className="font-mono text-[10px] font-black text-slate-900">{il.id}</span>
                      </td>
                      {/* Primary Agency */}
                      <td className="px-4 py-3 border-r border-slate-100 max-w-[150px]">
                        <p className="text-[11px] font-bold text-slate-800 leading-tight">{il.primary}</p>
                      </td>
                      {/* Conflicting Agency */}
                      <td className="px-4 py-3 border-r border-slate-100 max-w-[150px]">
                        <p className="text-[10px] text-slate-600 leading-tight">{il.conflict}</p>
                      </td>
                      {/* Location */}
                      <td className="px-4 py-3 border-r border-slate-100 whitespace-nowrap">
                        <span className="text-[10px] text-slate-500 font-mono">{il.location}</span>
                      </td>
                      {/* Cost */}
                      <td className="px-4 py-3 border-r border-slate-100 whitespace-nowrap">
                        <span className="text-[11px] font-black text-red-700 font-mono">{il.delayCost}</span>
                      </td>
                      {/* Stage */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <span className={`text-[8.5px] font-black border px-1.5 py-0.5 uppercase tracking-widest font-mono ${il.stageColor}`}>
                          {il.stage}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${il.statusColor}`} />
                          <span className="text-[9px] font-black text-slate-700 uppercase tracking-wider">{il.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Row expansion: brief desc */}
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Latest Interlock Detail
                </p>
                {INTERLOCKS.slice(0, 1).map((il) => (
                  <div key={il.id} className="flex items-start gap-3 bg-white border border-slate-200 p-3">
                    <div className={`w-1.5 self-stretch shrink-0 ${il.statusColor}`} />
                    <div>
                      <p className="text-[10px] font-black text-slate-900 font-mono">{il.id} — {il.primary}</p>
                      <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">{il.desc}</p>
                    </div>
                    <button
                      onClick={() => navigate('/authority/coordination')}
                      className="shrink-0 ml-auto flex items-center gap-0.5 text-[9px] font-black text-[#0B1B3D] uppercase tracking-wider hover:underline"
                    >
                      Review <ChevronRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: GIS Spatial Map (40%) ─────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col overflow-hidden bg-white">

            {/* Map Panel Header */}
            <div className="bg-white border-b border-slate-300 px-5 py-2.5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.18em]">
                  Bhopal Spatial Clash Map
                </h3>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                  Live GIS — Interlock & Conflict Overlay
                </p>
              </div>
              <button
                onClick={() => navigate('/authority/map')}
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-1.5 border border-slate-200 hover:border-slate-400 transition-all"
                title="Open full GIS view"
              >
                <Expand size={12} />
              </button>
            </div>

            {/* Map Viewport */}
            <div className="flex-1 relative min-h-[280px] border-b border-slate-200">
              {/* Institutional border frame */}
              <div className="absolute inset-0 border-4 border-[#0B1B3D]/10 z-10 pointer-events-none" />
              <UnityMap activeLayers={['road_projects', 'conflict_zones', 'utilities', 'road_closures']} />
            </div>

            {/* Legend */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0">
              <p className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest mr-2">Legend:</p>
              {MAP_LEGEND.map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-[9px] text-slate-600 font-semibold">
                  <span className={`w-2.5 h-2.5 shrink-0 ${color}`} />
                  {label}
                </span>
              ))}
            </div>

            {/* Sentinel AI Recommendation Panel */}
            <div className="px-5 py-4 bg-white flex flex-col gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Cpu size={12} className="text-[#0B1B3D] shrink-0" />
                <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                  Sentinel AI&nbsp;·&nbsp;Predictive Advisory
                </p>
                <span className="ml-auto text-[8.5px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase">
                  CONFIDENCE: 94.2%
                </span>
              </div>

              <div className="bg-[#0B1B3D]/5 border border-[#0B1B3D]/20 p-3">
                <p className="text-[10px] text-slate-800 font-semibold leading-relaxed">
                  Revenue Department approval delay (IL-BPL-001) is cascading into 3 downstream PWD work packages.
                  Estimated cost escalation: <span className="font-black text-red-700">₹41 Lakh / week</span> if unresolved.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="border border-slate-300 p-2.5 bg-slate-50">
                  <p className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest">Recommended Action</p>
                  <p className="text-[10px] font-bold text-slate-900 mt-1 leading-tight">
                    Issue joint clearance directive within 48 hrs
                  </p>
                </div>
                <div className="border border-emerald-300 p-2.5 bg-emerald-50">
                  <p className="text-[8.5px] font-black text-emerald-700 uppercase tracking-widest">Potential Saving</p>
                  <p className="text-lg font-black text-emerald-800 leading-none mt-1">₹41 L</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/authority/brief')}
                className="text-[10px] font-black text-[#0B1B3D] border border-[#0B1B3D] px-4 py-2 hover:bg-[#0B1B3D] hover:text-white transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 w-full"
              >
                Full Executive Analysis <ArrowRight size={11} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── STATUS FOOTER BAR ──────────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-300 px-5 py-2 flex items-center gap-0 shrink-0 overflow-x-auto divide-x divide-slate-200">
        {STATUS_ITEMS.map(({ Icon, label, value, sub, subColor }) => (
          <div key={label} className="flex items-center gap-2 px-4 py-1 shrink-0 first:pl-0">
            <Icon size={13} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest leading-none">{label}</p>
              <p className="text-[12px] font-black text-slate-900 leading-tight mt-0.5 font-mono">{value}</p>
              <p className={`text-[9px] font-bold leading-none mt-0.5 ${subColor}`}>{sub}</p>
            </div>
          </div>
        ))}
        {/* Session token far right */}
        <div className="ml-auto pl-4 flex items-center gap-1.5 shrink-0">
          <Shield size={10} className="text-emerald-600" />
          <span className="text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            SESSION: SECURE_INTRANET_TOKEN // TLS_1.3
          </span>
        </div>
      </div>

    </div>
  );
}
