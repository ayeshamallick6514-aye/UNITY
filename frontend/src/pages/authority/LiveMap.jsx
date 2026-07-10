import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UnityMap from '../../components/map/UnityMap';
import { MAP_LAYERS } from '../../utils/constants';
import {
  Flag, AlertTriangle, Users, Shield, TrendingUp, ArrowRight,
  Cloud, Flame, Radio, Building2, BarChart2, CheckCircle2,
  AlertCircle, Layers, Crosshair, ZoomIn, ZoomOut, Box,
  RefreshCw, LayoutGrid
} from 'lucide-react';

// ─── Layer dot colours (match screenshot) ────────────────────────────────────
const LAYER_COLORS = {
  road_projects:   'bg-blue-400',
  utilities:       'bg-emerald-400',
  departments:     'bg-orange-400',
  complaints:      'bg-purple-400',
  traffic:         'bg-blue-400',
  conflict_zones:  'bg-red-500',
  ward_boundaries: 'bg-blue-400',
  road_closures:   'bg-red-500',
};

// ─── MAE Feed ─────────────────────────────────────────────────────────────────
const MAE_FEED = [
  { color: 'bg-orange-400', title: 'Traffic diversion issued',  loc: 'MP Nagar Zone',   time: '2m ago' },
  { color: 'bg-emerald-400',title: 'Water main repair started', loc: 'Kolar Road',      time: '4m ago' },
  { color: 'bg-red-400',    title: 'Land approval pending',     loc: 'AIIMS Corridor',  time: '7m ago' },
];

// ─── Conflict Hotspots ────────────────────────────────────────────────────────
const HOTSPOTS = [
  { name: 'AIIMS Corridor Junction', desc: 'Land clearance delay',       level: 'High',   dot: 'bg-red-500',    badge: 'text-red-400 bg-red-950 border-red-800'    },
  { name: 'BHEL Square',             desc: 'Utility relocation pending', level: 'Medium', dot: 'bg-orange-400', badge: 'text-orange-400 bg-orange-950 border-orange-800' },
  { name: 'Kolar Road',              desc: 'Storm drain obstruction',    level: 'Medium', dot: 'bg-orange-400', badge: 'text-orange-400 bg-orange-950 border-orange-800' },
];

// ─── Department Sync ──────────────────────────────────────────────────────────
const DEPT_SYNC = [
  { name: 'PWD',     pct: 95, ok: true  },
  { name: 'Revenue', pct: 71, ok: false },
  { name: 'Traffic', pct: 83, ok: true  },
  { name: 'PHED',    pct: 91, ok: true  },
  { name: 'Energy',  pct: 65, ok: false },
];

// ─── CRI Gauge SVG ───────────────────────────────────────────────────────────
function CRIGauge({ value = 87 }) {
  const r = 38;
  const circ = Math.PI * r;
  const pct = Math.min(Math.max(value, 0), 100) / 100;
  const offset = circ * (1 - pct);
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center gap-0">
      <svg width="100" height="56" viewBox="0 0 100 56">
        <path d="M 10 52 A 38 38 0 0 1 90 52" fill="none" stroke="#1e2d45" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 52 A 38 38 0 0 1 90 52" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <p className="text-4xl font-black text-white -mt-4 leading-none">{value}</p>
      <p className="text-[10px] text-emerald-400 font-bold mt-1">High Performance</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveMap() {
  const navigate = useNavigate();
  const [activeLayers, setActiveLayers] = useState(
    MAP_LAYERS.filter(l => l.defaultOn).map(l => l.id)
  );

  const toggleLayer = (id) =>
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#08111e] font-sans text-white overflow-hidden">

      {/* ── THREE-COLUMN BODY ───────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 gap-0">

        {/* ═══ LEFT PANEL — Map Layers ══════════════════════════════════════ */}
        <aside className="w-56 shrink-0 bg-[#0b1624] border-r border-slate-800/60 flex flex-col overflow-y-auto dark-scroll">

          <div className="p-4 border-b border-slate-800/60">
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest leading-none">
              Map Layers Control
            </h3>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
              Toggle layers to visualize live coordination, risks and progress.
            </p>
          </div>

          {/* Active Overlays */}
          <div className="p-4 flex-1 space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Overlays</p>
            <div className="flex flex-col gap-1.5">
              {MAP_LAYERS.map(layer => {
                const isActive = activeLayers.includes(layer.id);
                const dotClass = LAYER_COLORS[layer.id] ?? 'bg-blue-400';
                return (
                  <label
                    key={layer.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-[11px] font-semibold transition-all border ${
                      isActive
                        ? 'bg-blue-950/40 border-blue-800/50 text-slate-200'
                        : 'bg-slate-900/30 border-slate-800/30 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${isActive ? dotClass : 'bg-slate-700'}`} />
                      {layer.label}
                    </span>
                    <input type="checkbox" className="sr-only" checked={isActive} onChange={() => toggleLayer(layer.id)} />
                    {isActive && <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Map Analytics */}
          <div className="p-4 border-t border-slate-800/60 space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Map Analytics</p>
            <div>
              <p className="text-[10px] text-slate-400">Live Coordination Score</p>
              <p className="text-2xl font-black text-emerald-400 leading-none mt-0.5">
                87 <span className="text-sm text-slate-500 font-normal">/100</span>
              </p>
            </div>

            {/* Mini Sparkline */}
            <svg width="100%" height="36" viewBox="0 0 160 36" preserveAspectRatio="none">
              <polyline
                points="0,32 20,28 40,30 60,22 80,18 100,20 120,14 140,10 160,8"
                fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
              />
              <polyline
                points="0,32 20,28 40,30 60,22 80,18 100,20 120,14 140,10 160,8"
                fill="url(#sparkGreen)" stroke="none"
              />
              <defs>
                <linearGradient id="sparkGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp size={11} /> 5 pts vs yesterday
            </p>
          </div>
        </aside>

        {/* ═══ CENTER — Map + KPIs + MAE Feed ═══════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* KPI Strip */}
          <div className="bg-[#0b1624]/80 border-b border-slate-800/60 px-4 py-2 grid grid-cols-4 gap-3 shrink-0">

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-400"><Flag size={13} /></div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Active Projects</p>
                <p className="text-xl font-black text-white leading-none mt-0.5">74</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-red-950 flex items-center justify-center text-red-400"><AlertTriangle size={13} /></div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Critical Interlocks</p>
                <p className="text-xl font-black text-red-400 leading-none mt-0.5">3</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-400"><Users size={13} /></div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Citizen Reports</p>
                <p className="text-xl font-black text-white leading-none mt-0.5">8</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-emerald-950 flex items-center justify-center text-emerald-400"><Shield size={13} /></div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Sentinel Status</p>
                <p className="text-sm font-black text-emerald-400 leading-none mt-0.5 flex items-center gap-1">
                  OPERATIONAL <CheckCircle2 size={11} />
                </p>
                <p className="text-[9px] text-slate-500 leading-none">AI Engine Online</p>
              </div>
            </div>

          </div>

          {/* Map */}
          <div className="flex-1 relative min-h-0">
            <UnityMap activeLayers={activeLayers} darkMode />

            {/* Zone Labels overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Zone labels matching screenshot positions */}
              <div className="absolute top-[15%] left-[28%] text-[10px] font-black text-white/70 uppercase tracking-widest">
                <span className="bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/40">Zone 2<br/><span className="text-[8px] font-bold text-slate-400">WEST</span></span>
              </div>
              <div className="absolute top-[12%] right-[30%] text-[10px] font-black text-white/70 uppercase tracking-widest">
                <span className="bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/40">Zone 5<br/><span className="text-[8px] font-bold text-slate-400">NORTH</span></span>
              </div>
              <div className="absolute top-[38%] right-[20%] text-[10px] font-black text-white/70 uppercase tracking-widest">
                <span className="bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/40">Zone 3<br/><span className="text-[8px] font-bold text-slate-400">CENTRAL</span></span>
              </div>
              <div className="absolute top-[50%] right-[10%] text-[10px] font-black text-white/70 uppercase tracking-widest">
                <span className="bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/40">Zone 4<br/><span className="text-[8px] font-bold text-slate-400">EAST</span></span>
              </div>
              <div className="absolute bottom-[22%] right-[28%] text-[10px] font-black text-white/70 uppercase tracking-widest">
                <span className="bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/40">Zone 1<br/><span className="text-[8px] font-bold text-slate-400">SOUTH</span></span>
              </div>
            </div>

            {/* Map Tool Controls */}
            <div className="absolute left-3 top-3 z-20 flex flex-col gap-1">
              {[Crosshair, ZoomIn, ZoomOut, Layers, RefreshCw].map((Icon, i) => (
                <button key={i} className="w-7 h-7 bg-[#0b1624]/90 border border-slate-700/60 rounded flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors shadow-md">
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>

          {/* MAE Feed */}
          <div className="bg-[#0b1624]/90 border-t border-slate-800/60 px-4 py-3 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MAE Feed</p>
            </div>
            <div className="flex gap-4 overflow-x-auto dark-scroll">
              {MAE_FEED.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 min-w-[180px]">
                  <div className={`w-6 h-6 rounded-lg ${item.color} flex items-center justify-center text-white shrink-0 mt-0.5`}>
                    <AlertCircle size={12} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-200 leading-none">{item.title}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{item.loc}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5 leading-none">{item.time}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('/authority/projects')}
                className="ml-auto text-[10px] font-bold text-blue-400 hover:text-blue-300 whitespace-nowrap flex items-center gap-0.5 transition-colors shrink-0"
              >
                View All Updates <ArrowRight size={11} />
              </button>
            </div>

            {/* Map Legend */}
            <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-slate-800/40 flex-wrap">
              {[
                { dot: 'bg-red-500',    label: 'Critical (CRI < 30)' },
                { dot: 'bg-orange-400', label: 'Moderate (50–79)'    },
                { dot: 'bg-emerald-400',label: 'Healthy (80+)'       },
                { dot: 'bg-blue-400',   label: 'Completed'           },
                { dot: 'bg-purple-400', label: 'Planned'             },
              ].map(({ dot, label }) => (
                <span key={label} className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  {label}
                </span>
              ))}
              <button className="ml-auto flex items-center gap-1 text-[9px] font-bold text-slate-400 border border-slate-700 px-2 py-0.5 rounded hover:border-slate-500 transition-colors">
                <Box size={10} /> 3D View
              </button>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ════════════════════════════════════════════════════ */}
        <aside className="w-60 shrink-0 bg-[#0b1624] border-l border-slate-800/60 flex flex-col overflow-y-auto dark-scroll">

          {/* CRI */}
          <div className="p-4 border-b border-slate-800/60">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Coordination Readiness (CRI)</p>
            <CRIGauge value={87} />
            <button
              onClick={() => navigate('/authority/dashboard')}
              className="mt-3 text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors"
            >
              View CRI Breakdown <ArrowRight size={11} />
            </button>
          </div>

          {/* Conflict Hotspots */}
          <div className="p-4 border-b border-slate-800/60 space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Conflict Hotspots</p>
            {HOTSPOTS.map((h) => (
              <div key={h.name} className="flex items-start gap-2.5">
                <span className={`w-2 h-2 rounded-full ${h.dot} mt-1 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-[11px] font-bold text-slate-200 leading-tight">{h.name}</p>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border whitespace-nowrap ${h.badge}`}>
                      {h.level}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{h.desc}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate('/authority/projects')}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors"
            >
              View All Hotspots <ArrowRight size={11} />
            </button>
          </div>

          {/* Department Sync */}
          <div className="p-4 flex-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Department Sync</p>
            <div className="space-y-3">
              {DEPT_SYNC.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-300 w-14 shrink-0">{d.name}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${d.pct >= 80 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 w-8 text-right shrink-0">{d.pct}%</span>
                  {d.ok
                    ? <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    : <AlertCircle  size={12} className="text-amber-400 shrink-0" />
                  }
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/authority/coordination')}
              className="mt-4 text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors"
            >
              View Full Matrix <ArrowRight size={11} />
            </button>
          </div>

        </aside>
      </div>

      {/* ── BOTTOM STATUS BAR ───────────────────────────────────────────────── */}
      <div className="bg-[#06101a] border-t border-slate-800/80 px-6 py-2.5 flex items-center gap-6 shrink-0 overflow-x-auto">

        <div className="flex items-center gap-2 shrink-0">
          <Cloud size={18} className="text-slate-500" />
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Weather</p>
            <p className="text-sm font-black text-white leading-tight">31°C</p>
            <p className="text-[9px] text-slate-400 leading-none">Partly Cloudy &nbsp;<span className="text-amber-400 font-bold">Work Risk: Moderate</span></p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-800 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 font-bold text-base">₹</span>
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Daily Burn</p>
            <p className="text-sm font-black text-white leading-tight">₹1,45,000</p>
            <p className="text-[9px] text-red-400 font-bold leading-none">▲ ₹12,000 vs yesterday</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-800 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <LayoutGrid size={16} className="text-slate-500" />
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Active Missions</p>
            <p className="text-sm font-black text-white leading-tight">74 / 112</p>
            <p className="text-[9px] text-slate-400 leading-none">66% On Track</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-800 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <Radio size={16} className="text-slate-500" />
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Emergency Broadcast</p>
            <p className="text-sm font-black text-emerald-400 leading-tight">No Active Alerts</p>
            <p className="text-[9px] text-slate-400 leading-none">All Clear</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-800 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <Shield size={16} className="text-slate-500" />
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">System Health</p>
            <p className="text-sm font-black text-emerald-400 leading-tight">All Systems Operational</p>
            <p className="text-[9px] text-slate-400 leading-none">Uptime 99.94%</p>
          </div>
        </div>

      </div>
    </div>
  );
}
