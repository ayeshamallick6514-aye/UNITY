import React, { useState } from 'react';
import { useDecisions } from '../../hooks/useDecisions';
import { useSentinel } from '../../hooks/useSentinel';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { parseBriefingSummary } from '../authority/ExecutiveBrief';

const BRIEF_FIELDS = [
  { key: 'assessment',              label: 'Situation Assessment'    },
  { key: 'rootCause',               label: 'Root Cause'              },
  { key: 'citizenImpact',           label: 'Citizen Impact'          },
  { key: 'financialExposure',       label: 'Financial Exposure'      },
  { key: 'operationalRisk',         label: 'Operational Risk'        },
  { key: 'recommendedIntervention', label: 'Executive Directive'     },
  { key: 'cascadeAnalysis',         label: 'Cascade Effect Analysis' },
  { key: 'noActionTaken',           label: 'If No Action Taken'      },
];

export default function AIRecommendations() {
  const { decisions, loading } = useDecisions();
  const { runReview, isReviewing } = useSentinel();

  const [selectedId, setSelectedId]     = useState('');
  const [activeReport, setActiveReport] = useState(null);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  const pendingDecisions = decisions.filter(d => d.escalationStatus !== 'authorized');

  const handleAudit = async (dependencyId, projectTitle) => {
    setSelectedId(dependencyId);
    setActiveReport(null);
    try {
      let decisionKey = 'dc1';
      if (projectTitle.includes('AIIMS')) decisionKey = 'dc2';
      else if (projectTitle.includes('Kolar')) decisionKey = 'dc3';
      const res = await runReview({ dependencyId, decisionKey });
      setActiveReport(res);
    } catch {
      alert('Sentinel audit failed. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans text-slate-800">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={16} className="text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Sentinel Decision Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Evaluate active blockages against standard circular guidelines using Sentinel vector search review
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-blue-950 text-blue-400 border border-blue-900 px-3 py-1 rounded-lg shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          SENTINEL ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Panel — Active Conflict List */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Conflicts ({pendingDecisions.length})
          </span>

          {pendingDecisions.length === 0 && (
            <Alert variant="success" title="All Conflicts Resolved">
              No active department interlocks requiring Sentinel analysis.
            </Alert>
          )}

          <div className="space-y-3">
            {pendingDecisions.map(d => {
              const isSelected = selectedId === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleAudit(d.id, d.project)}
                  className={`w-full text-left p-3.5 border rounded-xl cursor-pointer text-xs transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-800 leading-snug">{d.project}</span>
                    <Badge variant="critical">{d.daysPending}d</Badge>
                  </div>
                  <p className="text-slate-400 leading-relaxed line-clamp-2 font-normal">{d.situation}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertTriangle size={10} className="text-amber-500" />
                    <span className="text-[10px] font-mono text-amber-700 font-semibold">
                      {d.blockingDept}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel — Sentinel Audit Report */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Sentinel Audit Report
          </span>

          {!selectedId && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <ShieldCheck size={28} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">Select a conflict</p>
              <p className="text-xs text-slate-400 mt-1">
                Choose an active conflict on the left to execute a Sentinel vector audit.
              </p>
            </div>
          )}

          {selectedId && isReviewing && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <Zap size={24} className="text-blue-600 mx-auto mb-3 animate-pulse" />
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Running Sentinel Policy RAG Verification...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Querying knowledge base and synthesizing compliance report
              </p>
            </div>
          )}

          {selectedId && !isReviewing && activeReport && (
            <Card status="approved" className="animate-fade-in">
              <Card.Header className="bg-emerald-50/20">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Compliance Report
                    </span>
                  </div>
                  <Badge variant="approved">Confidence {activeReport.confidence}%</Badge>
                </div>
              </Card.Header>
              <Card.Body className="space-y-5">

                {/* Executive Directive Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                    Sentinel Directive Recommends
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-900 leading-snug">
                    {activeReport.recommendation}
                  </span>
                </div>

                {/* Parsed structured brief sections */}
                {(() => {
                  const parsed = parseBriefingSummary(activeReport.summary);
                  if (!parsed) {
                    return (
                      <p className="text-xs text-slate-600 leading-relaxed font-mono whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {activeReport.summary}
                      </p>
                    );
                  }
                  const populated = BRIEF_FIELDS.filter(f => parsed[f.key]?.trim());
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {populated.map(({ key, label }) => (
                        <div key={key} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <span className="font-bold text-slate-800 block mb-1 uppercase text-[10px] tracking-wider">
                            {label}
                          </span>
                          <p className="text-slate-500 leading-relaxed font-normal">{parsed[key]}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </Card.Body>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
