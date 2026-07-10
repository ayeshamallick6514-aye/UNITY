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
    department: 'Revenue Dept',
    nodalOfficer: 'Shri A. K. Verma',
    contact: '+91 9425010022',
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
    department: 'Water Supply Dept',
    nodalOfficer: 'Shri Manoj Patel',
    contact: '+91 9425043355',
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
    nodalOfficer: 'Shri S. K. Dwivedi',
    contact: '+91 9425032244',
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
    border: 'border-l-4 border-l-red-500',
    badge: 'bg-red-100 text-red-700',
    label: 'CRITICAL',
    icon: 'text-red-500',
  },
  high: {
    border: 'border-l-4 border-l-amber-500',
    badge: 'bg-amber-100 text-amber-700',
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame size={15} className="text-red-500" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Escalation Command Console
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {activeEscalations.length} active escalation{activeEscalations.length !== 1 ? 's' : ''} requiring executive attention
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-950 border border-red-900 px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE MONITORING · BHOPAL CELL
        </div>
      </div>

      {/* ─── Summary Strip ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Critical Escalations</p>
          <p className="text-3xl font-black text-red-600">{activeEscalations.filter(e => e.severity === 'critical').length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Total Days Overdue</p>
          <p className="text-3xl font-black text-amber-600">{activeEscalations.reduce((s, e) => s + e.daysOverdue, 0)}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Citizens Affected</p>
          <p className="text-3xl font-black text-gray-900">{activeEscalations.reduce((s, e) => s + e.citizensAffected, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Peak Exposure</p>
          <p className="text-3xl font-black text-red-600">₹23 Cr</p>
        </div>
      </div>

      {/* ─── Escalation Cards ────────────────────────────────────── */}
      <div className="space-y-4">
        {activeEscalations.map(esc => {
          const s = SEVERITY_STYLE[esc.severity] || SEVERITY_STYLE.high;
          const nudged = nudgeSent[esc.id];

          return (
            <div key={esc.id} className={`bg-white rounded-xl shadow-sm overflow-hidden ${s.border}`}>
              {/* Card Header */}
              <div className="px-5 py-3 border-b border-gray-50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} className={s.icon} />
                  <span className="text-sm font-bold text-gray-900">{esc.project}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${s.badge}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {esc.daysOverdue} days overdue
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">·</span>
                  <span className="text-[10px] font-mono text-gray-400">Last nudge: {esc.lastNudge}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Issue Description */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Issue</span>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{esc.issue}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Financial Exposure</span>
                      <p className="font-bold text-red-600 mt-0.5">{esc.financialExposure}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Penalty Status</span>
                      <p className="font-medium text-amber-700 mt-0.5">{esc.penalty}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Citizens Affected</span>
                      <p className="font-bold text-gray-900 mt-0.5">{esc.citizensAffected.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Escalation Level</span>
                      <p className="font-medium text-blue-700 mt-0.5">{esc.escalationLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Contact + Actions */}
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={13} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-700 uppercase">{esc.department}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900">{esc.nodalOfficer}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                      <Phone size={9} /> {esc.contact}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center text-xs"
                      onClick={() => navigate(`/authority/projects/${esc.projectId}`)}
                    >
                      <ShieldAlert size={13} /> Issue Directive
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center text-xs"
                      onClick={() => handleNudge(esc.id)}
                    >
                      {nudged
                        ? <><CheckCircle2 size={13} className="text-emerald-600" /> Nudge Sent!</>
                        : <><BellRing size={13} /> Send Nudge</>
                      }
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {activeEscalations.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">No active escalations</p>
            <p className="text-xs text-gray-400 mt-1">All department interlocks are resolved or on track.</p>
          </div>
        )}
      </div>
    </div>
  );
}
