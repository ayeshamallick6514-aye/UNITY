import React, { useState } from 'react';
import { useDecisions } from '../../hooks/useDecisions';
import { useDashboard } from '../../hooks/useDashboard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  AlertTriangle, Clock, ArrowUpRight, Building2,
  BellRing, CheckCircle2, Flame, ChevronRight,
  TrendingDown, User, Phone, ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ESCALATIONS = [
  {
    id: 'esc1',
    project: 'MP Nagar Road Widening',
    projectId: 'proj_mp_nagar',
    issue: 'Land compensation clearance has not been signed off despite 12 days overdue. Plot 47-B, MP Nagar extension zone.',
    department: 'Revenue Department',
    nodalOfficer: '[ROLE: REVENUE_NODAL_DESK]',
    contact: '+91-755-2540101',
    daysOverdue: 12,
    financialExposure: '₹14.5 Cr',
    penalty: 'Penalty trigger in 3 days',
    severity: 'critical',
    escalationLevel: 'District Collector',
    lastNudge: '2 hours ago',
    citizensAffected: 2400,
  },
  {
    id: 'esc2',
    project: 'AIIMS Pipeline Upgrade',
    projectId: 'proj_aiims',
    issue: 'Water supply shutdown window permit not issued. 48-hour coordination window required but not scheduled.',
    department: 'Water Supply Department',
    nodalOfficer: '[ROLE: BMC_WATER_NODAL_CELL]',
    contact: '+91-755-2540104',
    daysOverdue: 8,
    financialExposure: '₹3.5 Cr',
    penalty: 'No penalty yet — 10 days remaining',
    severity: 'high',
    escalationLevel: 'Municipal Commissioner',
    lastNudge: '6 hours ago',
    citizensAffected: 800,
  },
  {
    id: 'esc3',
    project: 'Kolar Road Utility Relocation',
    projectId: 'proj_kolar',
    issue: 'High-voltage pole relocation delayed 19 days. Penalty threshold already breached. Storm-drain work fully halted.',
    department: 'Energy Dept (MPEB)',
    nodalOfficer: '[ROLE: MPEB_SHIFTING_CELL]',
    contact: '+91-755-2540103',
    daysOverdue: 19,
    financialExposure: '₹5.2 Cr',
    penalty: '⚠️ Penalty already activated — ₹8L exposure',
    severity: 'critical',
    escalationLevel: 'Principal Secretary Energy',
    lastNudge: '1 day ago',
    citizensAffected: 1200,
  },
];

const SEVERITY_STYLE = {
  critical: {
    border: 'border-l-4 border-l-red-600',
    badge: 'bg-red-50 text-red-800 border-red-200',
    label: 'CRITICAL',
    icon: 'text-red-600',
  },
  high: {
    border: 'border-l-4 border-l-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    label: 'HIGH',
    icon: 'text-amber-500',
  },
};

export default function Escalations() {
  const navigate = useNavigate();
  const { brief } = useDashboard();
  const [nudgeSent, setNudgeSent] = useState({});
  const [resolved, setResolved] = useState({});

  const handleNudge = (id) => {
    setNudgeSent(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setNudgeSent(prev => ({ ...prev, [id]: false })), 3000);
  };

  const activeEscalations = ESCALATIONS.filter(e => !resolved[e.id]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans bg-slate-100 min-h-screen text-slate-900">
      
      {/* ─── Institutional Header ──────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              ZONE: BHOPAL_METRO_01
            </span>
            <span className="text-[9px] font-mono font-bold text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              ESCALATION_COMMAND_LAYER
            </span>
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mt-1 flex items-center gap-2">
            <Flame size={16} className="text-red-600" />
            Inter-Agency Escalation Command Console
          </h2>
          <p className="text-xs text-slate-500">
            {activeEscalations.length} active interlock escalation{activeEscalations.length !== 1 ? 's' : ''} requiring executive intervention
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-red-800 bg-red-50 border border-red-200 px-3 py-1.5 rounded self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          LIVE MONITORING · BHOPAL COMMAND CELL
        </div>
      </div>

      {/* ─── Summary Strip ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Critical Escalations</p>
          <p className="text-2xl font-black font-mono text-red-700">{activeEscalations.filter(e => e.severity === 'critical').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Total Days Overdue</p>
          <p className="text-2xl font-black font-mono text-amber-700">{activeEscalations.reduce((s, e) => s + e.daysOverdue, 0)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Citizens Impacted</p>
          <p className="text-2xl font-black font-mono text-slate-900">{activeEscalations.reduce((s, e) => s + e.citizensAffected, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Peak Exposure</p>
          <p className="text-2xl font-black font-mono text-red-700">₹23.2 Cr</p>
        </div>
      </div>

      {/* ─── Escalation Cards ────────────────────────────────────── */}
      <div className="space-y-4">
        {activeEscalations.map(esc => {
          const s = SEVERITY_STYLE[esc.severity] || SEVERITY_STYLE.high;
          const nudged = nudgeSent[esc.id];

          return (
            <div key={esc.id} className={`bg-white rounded-md shadow-2xs overflow-hidden border border-slate-200 ${s.border}`}>
              {/* Card Header */}
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={15} className={s.icon} />
                  <span className="text-xs font-black uppercase text-slate-900">{esc.project}</span>
                  <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${s.badge}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[9.5px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 font-bold text-red-700">
                    <Clock size={10} /> {esc.daysOverdue} days overdue
                  </span>
                  <span>·</span>
                  <span>Last nudge: {esc.lastNudge}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Issue Description */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Operational Conflict Description</span>
                    <p className="text-xs text-slate-800 mt-1 leading-relaxed">{esc.issue}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200 rounded p-3 font-mono">
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Financial Exposure</span>
                      <p className="font-bold text-red-700 text-[11px] mt-0.5">{esc.financialExposure}</p>
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Penalty Status</span>
                      <p className="font-bold text-amber-700 text-[11px] mt-0.5">{esc.penalty}</p>
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Citizens Affected</span>
                      <p className="font-bold text-slate-800 text-[11px] mt-0.5">{esc.citizensAffected.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Escalation Tier</span>
                      <p className="font-bold text-[#0B1B3D] text-[11px] mt-0.5">{esc.escalationLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Contact + Actions */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Building2 size={12} className="text-slate-500" />
                      <span className="text-[9px] font-black text-slate-700 uppercase">{esc.department}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 font-mono">{esc.nodalOfficer}</p>
                    <p className="text-[9.5px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                      <Phone size={9} /> {esc.contact}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center text-xs font-black uppercase tracking-wider bg-[#0B1B3D] text-white"
                      onClick={() => navigate(`/authority/projects/${esc.projectId}`)}
                    >
                      <ShieldAlert size={12} /> Issue Directive
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center text-xs font-bold uppercase tracking-wider border-slate-300"
                      onClick={() => handleNudge(esc.id)}
                    >
                      {nudged
                        ? <><CheckCircle2 size={12} className="text-emerald-700" /> Nudge Dispatched</>
                        : <><BellRing size={12} /> Send Alert Nudge</>
                      }
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {activeEscalations.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-md p-12 text-center">
            <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 uppercase">No active escalations</p>
            <p className="text-xs text-slate-400 mt-1">All departmental interlocks are synchronized or on schedule.</p>
          </div>
        )}
      </div>
    </div>
  );
}
