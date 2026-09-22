import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import UnityMap from '../../components/map/UnityMap';
import {
  AlertTriangle, Users, ArrowRight, Cpu, Expand,
  Cloud, Flame, Building2, Radio, Flag, Activity, Shield,
} from 'lucide-react';

// ─── Interlock Data (real Bhopal agencies) ────────────────────────────────────

const INTERLOCKS = [
  {
    id: 'IL-BPL-001',
    primary:   'MP Public Works Dept. (PWD)',
    conflict:  'Revenue Department, GoMP',
    location:  'MP Nagar, Ward 42',
    delayCost: '₹14.5 Cr',
    stage:     'PENALTY_IMMINENT',
    stageCls:  'text-red-700 bg-red-50 border-red-300',
    status:    'CRITICAL',
    dot:       'bg-red-600',
    desc:      'Land acquisition sign-offs pending 47 days. Carmel Convent zone clearance blocked. Penalty trigger: Friday.',
  },
  {
    id: 'IL-BPL-002',
    primary:   'Bhopal Smart City Dev. Corp.',
    conflict:  'MP Poorv Kshetra Vidyut Vitaran',
    location:  'AIIMS Corridor, Ward 28',
    delayCost: '₹3.5 Cr',
    stage:     'AWAITING_NOC',
    stageCls:  'text-amber-700 bg-amber-50 border-amber-300',
    status:    'HIGH',
    dot:       'bg-amber-500',
    desc:      'Excavation halted. Mandatory utility shutdown permit and dual-circuit coordination pending.',
  },
  {
    id: 'IL-BPL-003',
    primary:   'Bhopal Municipal Corporation',
    conflict:  'MP Poorv Kshetra Vidyut Vitaran',
    location:  'Kolar Road, Ward 55',
    delayCost: '₹5.2 Cr',
    stage:     'IN_REVIEW',
    stageCls:  'text-blue-700 bg-blue-50 border-blue-300',
    status:    'MEDIUM',
    dot:       'bg-blue-500',
    desc:      'Electricity board pole relocation blocking storm-drain layout. 19 days stalled.',
  },
  {
    id: 'IL-BPL-004',
    primary:   'MP Water Resources Department',
    conflict:  'Traffic Police, Bhopal City',
    location:  'VIP Road, Ward 11',
    delayCost: '₹2.1 Cr',
    stage:     'ESCALATED',
    stageCls:  'text-red-700 bg-red-50 border-red-300',
    status:    'HIGH',
    dot:       'bg-amber-500',
    desc:      'Water main diversion requires road closure permit. Escalated to Collector level.',
  },
  {
    id: 'IL-BPL-005',
    primary:   'Smart Road Package II — BMC',
    conflict:  'Traffic Police, Bhopal City',
    location:  'DB Mall Junction, Ward 19',
    delayCost: '₹1.8 Cr',
    stage:     'AWAITING_NOC',
    stageCls:  'text-amber-700 bg-amber-50 border-amber-300',
    status:    'MEDIUM',
    dot:       'bg-blue-500',
    desc:      'Traffic diversion plan under police review. Expected clearance in 4 days.',
  },
];

// ─── Telemetry Ribbon ─────────────────────────────────────────────────────────

const TELEMETRY = [
  { label: 'Active Work Packages',     value: '74',        unit: 'ACTIVE',          sub: '+8 since 0800 hrs',     subCls: 'text-emerald-700', accent: 'border-t-2 border-t-slate-400',   icon: Flag         },
  { label: 'Critical Spatial Interlocks', value: '3',     unit: 'SEVERE',          sub: 'Immediate action required', subCls: 'text-red-700',  accent: 'border-t-2 border-t-red-600',    icon: AlertTriangle, valueCls: 'text-red-700' },
  { label: 'Unresolved Grievances',    value: '8',         unit: 'PENDING',         sub: 'Awaiting field validation',subCls: 'text-slate-500', accent: 'border-t-2 border-t-amber-500',  icon: Users        },
  { label: 'Sentinel Engine',          value: 'RAG_ACTIVE',unit: 'CONF: 94.2%',    sub: 'Policy inference online', subCls: 'text-emerald-700', accent: 'border-t-2 border-t-emerald-500',icon: Cpu, valueCls: 'text-emerald-700 text-sm' },
  { label: 'Coord. Readiness (CRI)',   value: '87.4',      unit: '/ 100',           sub: 'High Performance Band',  subCls: 'text-emerald-700', accent: 'border-t-2 border-t-emerald-500', icon: Activity     },
];

// ─── Status Footer ────────────────────────────────────────────────────────────

const STATUS_ITEMS = [
  { Icon: Cloud,     label: 'Field Conditions', value: '31°C Monsoon',  sub: 'Work Risk: HIGH',    subCls: 'text-amber-700'   },
  { Icon: Flame,     label: 'Daily Idle Burn',  value: '₹1,45,000',    sub: '▲ ₹12,000 vs T-1',  subCls: 'text-red-600'     },
  { Icon: Building2, label: 'Depts. Online',    value: '18 / 24',       sub: '75% Operational',    subCls: 'text-slate-500'   },
  { Icon: Radio,     label: 'Emergency',        value: 'NIL ACTIVE',    sub: 'Situation Normal',   subCls: 'text-emerald-700' },
  { Icon: Shield,    label: 'System Health',    value: 'OPERATIONAL',   sub: 'Uptime 99.94%',      subCls: 'text-emerald-700' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [syncTs, setSyncTs] = useState('');

  useEffect(() => {
    const now = new Date();
    setSyncTs(
      now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit',
        hour12: false, timeZone: 'Asia/Kolkata',
      }) + ' IST'
    );
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-100 text-slate-900 font-sans">

      {/* ── SECTION HEADER ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
            District Operations — Command View
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Bhopal Metro Zone 01 &nbsp;·&nbsp; MPOnline Problem Statement 5 &nbsp;·&nbsp; Synced {syncTs || '--:--'}
          </p>
        </div>
        <button
          onClick={() => navigate('/authority/coordination')}
          className="flex items-center gap-2 text-xs font-bold text-[#0B1B3D] border border-[#0B1B3D] px-4 py-2 hover:bg-[#0B1B3D] hover:text-white transition-all uppercase tracking-wider"
        >
          View All Interlocks <ArrowRight size={12} />
        </button>
      </div>

      {/* ── TELEMETRY RIBBON ────────────────────────────────────────────────── */}
      <div className="px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {TELEMETRY.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className={`bg-white border border-slate-200 rounded-md p-4 ${t.accent}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} className="text-slate-400 shrink-0" />
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{t.label}</p>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-black leading-none tabular-nums ${t.valueCls || 'text-slate-900'}`}>
                    {t.value}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{t.unit}</span>
                </div>
                <p className={`text-[10px] font-semibold mt-1.5 ${t.subCls}`}>{t.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAIN SPLIT: 70 / 30 ─────────────────────────────────────────────── */}
      <div className="flex-1 px-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

          {/* ── LEFT 70%: Interlocks Table ──────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Table card */}
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    Active Interdepartmental Interlocks
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {INTERLOCKS.length} flagged work packages — real-time dependency feed
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Interlock ID','Primary Agency','Conflicting Agency','Location','Est. Cost','Stage','Status'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-600 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {INTERLOCKS.map((il) => (
                      <tr
                        key={il.id}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => navigate('/authority/coordination')}
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-[10px] font-black text-slate-800">{il.id}</span>
                        </td>
                        <td className="px-5 py-3.5 max-w-[160px]">
                          <p className="text-[11px] font-semibold text-slate-800 leading-tight">{il.primary}</p>
                        </td>
                        <td className="px-5 py-3.5 max-w-[160px]">
                          <p className="text-[10px] text-slate-500 leading-tight">{il.conflict}</p>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-[10px] text-slate-500 font-mono">{il.location}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-[11px] font-black text-red-700 font-mono">{il.delayCost}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[9px] font-black border px-2 py-0.5 rounded uppercase tracking-wider font-mono ${il.stageCls}`}>
                            {il.stage}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${il.dot}`} />
                            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wide">{il.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sentinel Advisory Card */}
            <div className="bg-white border border-slate-200 rounded-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={14} className="text-[#0B1B3D]" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  Sentinel Predictive Advisory
                </h3>
                <span className="ml-auto text-[9px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                  Confidence 94.2%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-md p-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">AI Assessment</p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Revenue Department approval delay (IL-BPL-001) is cascading into 3 downstream PWD work packages.
                    Estimated cost escalation: <span className="font-black text-red-700">₹41 Lakh / week</span> if unresolved past Friday.
                  </p>
                  <p className="text-[10px] font-bold text-slate-700 mt-3 bg-white border border-slate-200 rounded px-3 py-2">
                    ↳ Recommended: Issue joint clearance directive within 48 hrs
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 text-center flex-1">
                    <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Potential Saving</p>
                    <p className="text-2xl font-black text-emerald-800 mt-1 leading-none">₹41L</p>
                  </div>
                  <button
                    onClick={() => navigate('/authority/brief')}
                    className="text-[10px] font-black text-[#0B1B3D] border border-[#0B1B3D] px-3 py-2.5 hover:bg-[#0B1B3D] hover:text-white transition-all uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    Full Analysis <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT 30%: GIS Map ──────────────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Map card */}
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    Spatial Clash Map
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Bhopal — Live GIS overlay</p>
                </div>
                <button
                  onClick={() => navigate('/authority/map')}
                  className="text-slate-400 hover:text-slate-800 p-1.5 border border-slate-200 hover:border-slate-400 transition-all rounded"
                  title="Full GIS view"
                >
                  <Expand size={12} />
                </button>
              </div>

              {/* Leaflet viewport */}
              <div className="relative" style={{ height: '280px' }}>
                <UnityMap activeLayers={['road_projects', 'conflict_zones', 'utilities', 'road_closures']} />
              </div>

              {/* Legend */}
              <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap gap-x-3 gap-y-1.5 bg-slate-50">
                {[
                  { dot: 'bg-red-600',     label: 'Critical'  },
                  { dot: 'bg-amber-500',   label: 'High'      },
                  { dot: 'bg-blue-500',    label: 'Review'    },
                  { dot: 'bg-emerald-600', label: 'Cleared'   },
                ].map(({ dot, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[9px] text-slate-500 font-semibold">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick stats card */}
            <div className="bg-white border border-slate-200 rounded-md p-5">
              <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">
                Operational Snapshot
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Cost Exposure',   value: '₹27.1 Cr',  color: 'text-red-700'     },
                  { label: 'Avg. Stall Duration',   value: '22 Days',   color: 'text-amber-700'   },
                  { label: 'Departments Involved',  value: '8 Active',  color: 'text-slate-800'   },
                  { label: 'Decisions Pending',     value: '3 Orders',  color: 'text-[#0B1B3D]'   },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                    <span className="text-[10px] text-slate-500">{label}</span>
                    <span className={`text-xs font-black font-mono ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── STATUS FOOTER ───────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-200 px-8 py-2.5 flex items-center gap-0 divide-x divide-slate-200 overflow-x-auto shrink-0">
        {STATUS_ITEMS.map(({ Icon, label, value, sub, subCls }) => (
          <div key={label} className="flex items-center gap-2.5 px-6 py-1 first:pl-0 shrink-0">
            <Icon size={13} className="text-slate-400" />
            <div>
              <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
              <p className="text-xs font-black text-slate-900 leading-tight mt-0.5 font-mono">{value}</p>
              <p className={`text-[9px] font-semibold mt-0.5 ${subCls}`}>{sub}</p>
            </div>
          </div>
        ))}
        <div className="ml-auto pl-6 flex items-center gap-1.5 shrink-0">
          <Shield size={10} className="text-emerald-600" />
          <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-widest">
            SESSION: SECURE_INTRANET_TOKEN // TLS_1.3
          </span>
        </div>
      </div>

    </div>
  );
}
