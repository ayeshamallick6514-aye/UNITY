import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Download, FileBarChart2 } from 'lucide-react';

const REPORTS = [
  { id: 'rep_001', name: 'Weekly Bhopal Infrastructure Status Report',          date: '08 July 2025', size: '1.2 MB', type: 'weekly'   },
  { id: 'rep_002', name: 'Inter-departmental Coordination NOC Audit Summary',    date: '01 July 2025', size: '2.4 MB', type: 'audit'    },
  { id: 'rep_003', name: 'Bhopal District Collectorate Monthly Coordination Brief', date: '15 June 2025', size: '3.1 MB', type: 'monthly' },
];

const TYPE_BADGE = {
  weekly:  'bg-blue-50 text-blue-700 border-blue-200',
  audit:   'bg-amber-50 text-amber-700 border-amber-200',
  monthly: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function ExecutiveReports() {
  const { brief, loading } = useDashboard();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  const handleDownload = (name) => alert(`Initiating secure download: ${name}`);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto font-sans text-slate-800">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileBarChart2 size={15} className="text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Executive Reports Registry
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Downloadable coordination summaries and department audit reports compiled under UNITY Bhopal
          </p>
        </div>
      </div>

      {/* District Brief Summary */}
      <Card>
        <Card.Header className="bg-slate-50/50">
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            District Collector Brief Summary
          </Card.Title>
        </Card.Header>
        <Card.Body className="space-y-3 text-xs">
          <p className="text-slate-500 leading-relaxed">
            Standard metrics summary formatted for executive morning brief presentations:
          </p>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Blocked Projects</span>
              <p className="text-xl font-black text-red-600 mt-1">{brief?.blockedProjectsCount ?? 0}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Active Interlocks</span>
              <p className="text-xl font-black text-amber-600 mt-1">{brief?.pendingDependenciesCount ?? 0}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Units Affected</span>
              <p className="text-xl font-black text-slate-800 mt-1">{brief?.blockedDepartmentsCount ?? 0}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Max Delay Days</span>
              <p className="text-xl font-black text-slate-800 mt-1">{brief?.longestStallDays ?? 0}d</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Download Registry */}
      <Card>
        <Card.Header className="bg-slate-50/50">
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Available Downloads
          </Card.Title>
        </Card.Header>
        <Card.Body className="divide-y divide-slate-100 p-0">
          {REPORTS.map(rep => (
            <div key={rep.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                  <FileText size={14} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{rep.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider font-mono ${TYPE_BADGE[rep.type]}`}>
                      {rep.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rep.date} · {rep.size}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={Download} onClick={() => handleDownload(rep.name)}>
                Download
              </Button>
            </div>
          ))}
        </Card.Body>
      </Card>

    </div>
  );
}
