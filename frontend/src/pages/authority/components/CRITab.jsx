import React from 'react';
import Card from '../../../components/ui/Card';
import CRIWidget from '../../../components/CRIWidget';

export default function CRITab({ cri }) {
  if (!cri) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <CRIWidget cri={cri} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
              CRI Metrics Summary
            </Card.Title>
          </Card.Header>
          <Card.Body className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Total Scoped Tasks:</span>
              <span className="font-bold text-slate-800">{cri.stats?.totalTasks}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Active Blocked Tasks:</span>
              <span className="font-bold text-red-600">{cri.stats?.blockedTasks}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Department Tasks Completed:</span>
              <span className="font-bold text-emerald-600">{cri.stats?.completedTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Peak Stall Duration:</span>
              <span className="font-bold text-amber-600">{cri.stats?.maxStallDays} Days</span>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Coordination Instructions
            </Card.Title>
          </Card.Header>
          <Card.Body className="text-xs text-slate-600 leading-relaxed font-normal">
            The Coordination Readiness Index (CRI) is evaluated across 5 administrative parameters. Unblocking land clearance notifications and scheduling utility clearances will automatically improve the index score. Navigate to the **Clearance Console** to dispatch executive override signatures.
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
