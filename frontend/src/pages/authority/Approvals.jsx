import React, { useState } from 'react';
import { useDecisions } from '../../hooks/useDecisions';
import useAuthStore from '../../store/authStore';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import { Clock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Approvals() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { decisions, executeAction, loading, isExecuting } = useDecisions();
  
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

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
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Clearance Console</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Pending inter-departmental blocks awaiting signature authorization by the District Collector or Commissioner
        </p>
      </div>

      {/* ─── Decisions List ──────────────────────────────────────── */}
      {pendingDecisions.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-12 text-center text-gray-400 text-sm">
          No pending decision clearances in queue. All systems operating normally.
        </div>
      ) : (
        <div className="space-y-6">
          {pendingDecisions.map(d => {
            const isSelected = selectedId === d.id;
            const isAuthorizedRole = user?.role === 'collector' || user?.role === 'commissioner';

            return (
              <Card
                key={d.id}
                status={d.daysPending > 10 ? 'critical' : 'high'}
                className="overflow-hidden"
              >
                <Card.Header className="bg-gray-50/20 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-gray-900">
                      {d.project}
                    </span>
                    <Badge variant={d.daysPending > 10 ? 'critical' : 'high'}>
                      {d.daysPending}d stalled
                    </Badge>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    ID: {d.id.substring(d.id.length - 8).toUpperCase()}
                  </span>
                </Card.Header>

                <Card.Body className="space-y-4">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{d.situation}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 border border-gray-100 rounded-md p-3">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">Waiting Agency</span>
                      <p className="font-semibold text-gray-700">{d.waitingDept}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">Blocking Agency</span>
                      <p className="font-semibold text-gray-700">{d.blockingDept}</p>
                    </div>
                  </div>

                  {/* Form toggle */}
                  {!isSelected ? (
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/authority/projects/${d.project === 'MP Nagar Road Widening' ? 'proj_mp_nagar' : d.project === 'AIIMS Pipeline Upgrade' ? 'proj_aiims' : 'proj_kolar'}`)}
                      >
                        Inspect Path Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedId(d.id);
                          setReason('');
                        }}
                      >
                        Dispatch Directive
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-3 border-t border-gray-50 animate-fade-in">
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
                        >
                          Cancel
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
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
                            title={!isAuthorizedRole ? 'Signature delegation required. Only Collector or Commissioner can authorize directives.' : undefined}
                          >
                            Sign &amp; Dispatch NOC
                          </Button>
                        </div>
                      </div>
                      
                      {!isAuthorizedRole && (
                        <p className="text-[10px] text-amber-600 font-medium">
                          ⚠️ Only the Collector or Commissioner has delegation authority to dispatch directive approvals. Lower roles can only escalate blocks.
                        </p>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
