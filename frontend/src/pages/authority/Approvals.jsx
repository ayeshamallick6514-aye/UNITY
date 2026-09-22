import React, { useState } from 'react';
import { useDecisions } from '../../hooks/useDecisions';
import useAuthStore from '../../store/authStore';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import CLockClearanceHub from '../../components/authority/CLockClearanceHub';
import {
  Clock, ShieldCheck, AlertCircle, Lock,
  CheckCircle2, FileCheck2, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Approvals() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { decisions, executeAction, loading, isExecuting } = useDecisions();
  
  const [activeTab, setActiveTab] = useState('clock'); // 'clock' | 'directives'
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');

  // Filter pending decisions (not authorized yet)
  const pendingDecisions = decisions.filter(d => d.escalationStatus !== 'authorized');

  const handleActionSubmit = async (dependencyId, action) => {
    if (!reason) {
      alert('Please provide an administrative reason or policy circular reference.');
      return;
    }
    try {
      await executeAction({
        dependencyId,
        action,
        reason
      });
      setReason('');
      setSelectedId('');
      alert(`Directive successfully submitted with action: ${action.toUpperCase()}`);
    } catch (err) {
      alert(err.message || 'Action authorization failed.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto font-sans bg-slate-100 min-h-screen text-slate-900">
      
      {/* ─── Institutional Header ─────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              ZONE: BHOPAL_METRO_01
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              CLEARANCE_AUTHORITY_HUB
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1 uppercase">
            Executive Clearance &amp; C-Lock Coordination Hub
          </h2>
          <p className="text-xs text-slate-500">
            Multi-agency dependency clearance, statutory C-Lock synchronization, and Collectorate executive directives.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded">
          <button
            onClick={() => setActiveTab('clock')}
            className={`px-3.5 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'clock'
                ? 'bg-[#0B1B3D] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            C-Lock Engine ({3})
          </button>
          <button
            onClick={() => setActiveTab('directives')}
            className={`px-3.5 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'directives'
                ? 'bg-[#0B1B3D] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Directives Queue ({pendingDecisions.length})
          </button>
        </div>
      </div>

      {/* ─── TAB 1: C-Lock State Engine Hub ──────────────────────────────────── */}
      {activeTab === 'clock' && (
        <CLockClearanceHub />
      )}

      {/* ─── TAB 2: Executive Directives Queue ────────────────────────────────── */}
      {activeTab === 'directives' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-md p-4 flex items-center justify-between shadow-2xs">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Pending Inter-Departmental Escalation Directives
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Statutory delegations requiring executive signature
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
              {pendingDecisions.length} PENDING DECISIONS
            </span>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-xs font-mono text-slate-400 animate-pulse">
              LOADING EXECUTIVE QUEUE...
            </div>
          ) : pendingDecisions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-slate-400 text-xs font-mono">
              No pending decision directives in queue. All inter-agency clearance orders processed.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDecisions.map(d => {
                const isSelected = selectedId === d.id;
                const isAuthorizedRole = user?.role === 'collector' || user?.role === 'commissioner';

                return (
                  <div
                    key={d.id}
                    className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden"
                  >
                    <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-slate-900 font-mono">
                          {d.project}
                        </span>
                        <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                          d.daysPending > 10
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {d.daysPending}d Stalled
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                        ID: {d.id.substring(d.id.length - 8).toUpperCase()}
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{d.situation}</p>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200 rounded p-3">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Waiting Agency</span>
                          <p className="font-bold text-slate-800 text-[11px]">{d.waitingDept}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Blocking Agency</span>
                          <p className="font-bold text-slate-800 text-[11px]">{d.blockingDept}</p>
                        </div>
                      </div>

                      {/* Form toggle */}
                      {!isSelected ? (
                        <div className="flex items-center justify-between gap-3 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold uppercase text-slate-600"
                            onClick={() => navigate(`/authority/projects/${d.project === 'MP Nagar Road Widening' ? 'proj_mp_nagar' : d.project === 'AIIMS Pipeline Upgrade' ? 'proj_aiims' : 'proj_kolar'}`)}
                          >
                            Inspect Path Details
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs font-bold uppercase bg-[#0B1B3D] text-white"
                            onClick={() => {
                              setSelectedId(d.id);
                              setReason('');
                            }}
                          >
                            Dispatch Directive
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
                          <Textarea
                            label="Executive Action Reason / Regulatory SOP Reference"
                            id="action-reason"
                            rows={3}
                            placeholder="e.g. Authorized conditional waiver under Section 2.5 of Acquisition SOP, retrospectively clearing asphalt works..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isExecuting}
                          />

                          <div className="flex items-center justify-between gap-3">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setSelectedId('')}
                              disabled={isExecuting}
                              className="text-xs uppercase"
                            >
                              Cancel
                            </Button>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-700 hover:bg-red-50 text-xs uppercase font-bold"
                                onClick={() => handleActionSubmit(d.id, 'escalate')}
                                loading={isExecuting}
                              >
                                Escalate
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleActionSubmit(d.id, 'authorize')}
                                loading={isExecuting}
                                disabled={!isAuthorizedRole}
                                className="text-xs uppercase font-bold bg-[#0B1B3D] text-white"
                                title={!isAuthorizedRole ? 'Signature delegation required. Only Collector or Commissioner can authorize directives.' : undefined}
                              >
                                Sign &amp; Dispatch NOC
                              </Button>
                            </div>
                          </div>
                          
                          {!isAuthorizedRole && (
                            <p className="text-[10px] text-amber-700 font-medium">
                              ⚠️ Only the Collector or Commissioner has delegation authority to dispatch directive approvals. Lower roles can only escalate blocks.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
