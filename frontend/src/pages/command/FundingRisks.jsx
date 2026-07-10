import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import KPIBlock from '../../components/ui/KPIBlock';
import Progress from '../../components/ui/Progress';
import { TrendingDown, CheckCircle2, DollarSign } from 'lucide-react';

const PROJECTS_FINANCIAL = [
  {
    id: 'proj_mp_nagar',
    name: 'MP Nagar Road Widening',
    budget: 14.5, dailyBurn: 80000, daysStalled: 12,
    penaltyDate: '+3 days', penaltyValue: 2.3, penaltyTriggered: false,
    status: 'critical', riskCategory: 'Revenue NOC',
  },
  {
    id: 'proj_kolar',
    name: 'Kolar Road Utility Relocation',
    budget: 5.2, dailyBurn: 40000, daysStalled: 19,
    penaltyDate: 'Activated', penaltyValue: 0.8, penaltyTriggered: true,
    status: 'critical', riskCategory: 'Energy NOC',
  },
  {
    id: 'proj_aiims',
    name: 'AIIMS Pipeline Upgrade',
    budget: 3.5, dailyBurn: 25000, daysStalled: 8,
    penaltyDate: '+10 days', penaltyValue: 0.5, penaltyTriggered: false,
    status: 'high', riskCategory: 'Water Dept NOC',
  },
];

const crore = (n) => `₹${n.toFixed(2)} Cr`;
const lakh  = (n) => `₹${(n / 100000).toFixed(1)}L`;

export default function FundingRisks() {
  const totalExposure = PROJECTS_FINANCIAL.reduce((s, p) => s + p.budget, 0);
  const totalBurn     = PROJECTS_FINANCIAL.reduce((s, p) => s + p.dailyBurn * p.daysStalled, 0);
  const totalPenalty  = PROJECTS_FINANCIAL.reduce((s, p) => s + p.penaltyValue, 0);
  const triggered     = PROJECTS_FINANCIAL.filter(p => p.penaltyTriggered).length;
  const dailyRate     = (80000 + 40000 + 25000);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={15} className="text-red-600" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Funding Risk Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Idle burn rate, penalty exposure, and avoidable financial loss across blocked projects
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-950 border border-red-900 px-3 py-1 rounded-lg shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {triggered} PENALTY ACTIVE
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIBlock value={`₹${totalExposure.toFixed(1)} Cr`} label="Total Capital Exposed"   sublabel="3 projects blocked"       color="red"   />
        <KPIBlock value={lakh(totalBurn)}                   label="Accumulated Idle Loss"    sublabel="Since stall began"        color="red"   />
        <KPIBlock value={`₹${totalPenalty.toFixed(1)} Cr`} label="Avoidable Penalty Risk"   sublabel={`${triggered} already triggered`} color="amber" />
        <KPIBlock value={`₹${(dailyRate / 1000).toFixed(0)}k`} label="Daily Burn Rate"      sublabel="Per day while blocked"   color="amber" />
      </div>

      {/* Project Financial Cards */}
      <div className="space-y-4">
        {PROJECTS_FINANCIAL.map(p => {
          const idleLoss   = p.dailyBurn * p.daysStalled;
          const burnPct    = Math.min((idleLoss / (p.budget * 10000000)) * 100 * 5, 100);
          const isCritical = p.status === 'critical';

          return (
            <Card key={p.id} status={isCritical ? 'critical' : 'high'}>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} className={isCritical ? 'text-red-600' : 'text-amber-600'} />
                  <span className="text-sm font-bold text-slate-900">{p.name}</span>
                  {p.penaltyTriggered && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase animate-pulse">
                      Penalty Active
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400">{p.riskCategory}</span>
              </Card.Header>
              <Card.Body className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">DPR Budget</span>
                    <p className="text-lg font-black text-slate-900">{crore(p.budget)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Daily Idle Burn</span>
                    <p className="text-lg font-black text-red-600">₹{(p.dailyBurn / 1000).toFixed(0)}k/day</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Accumulated Loss</span>
                    <p className="text-lg font-black text-red-600">{lakh(idleLoss)}</p>
                    <p className="text-[10px] text-slate-400">{p.daysStalled} days stalled</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Penalty Trigger</span>
                    <p className={`text-lg font-black ${p.penaltyTriggered ? 'text-red-600' : 'text-amber-600'}`}>
                      {p.penaltyDate}
                    </p>
                    <p className="text-[10px] text-slate-400">₹{p.penaltyValue.toFixed(1)} Cr at risk</p>
                  </div>
                </div>

                <Progress
                  value={burnPct}
                  max={100}
                  color="red"
                  label="Idle burn vs total budget"
                  showValue
                />
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Recovery Potential */}
      <Card>
        <Card.Header>
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            Recovery Potential — If Resolved Today
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[10px] uppercase font-bold text-emerald-700 mb-2">Penalties Avoided</p>
              <p className="text-2xl font-black text-emerald-700">₹{(totalPenalty - 0.8).toFixed(1)} Cr</p>
              <p className="text-[10px] text-emerald-600 mt-1">MP Nagar + AIIMS penalties still preventable</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-[10px] uppercase font-bold text-blue-700 mb-2">Daily Burn Saved</p>
              <p className="text-2xl font-black text-blue-700">₹1.45L/day</p>
              <p className="text-[10px] text-blue-600 mt-1">If all 3 projects unblocked immediately</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] uppercase font-bold text-amber-700 mb-2">Projects Back On Track</p>
              <p className="text-2xl font-black text-amber-700">3</p>
              <p className="text-[10px] text-amber-600 mt-1">All milestones can resume within 48 hours</p>
            </div>
          </div>
        </Card.Body>
      </Card>

    </div>
  );
}
