import React from 'react';
import { Brain, Play } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';

export default function ApprovalsTab({
  user,
  isBlocked,
  isExecuting,
  isReviewing,
  actionReason,
  setActionReason,
  handleAction,
  handleRunAudit,
  auditResult,
}) {
  const isAuthorizedRole = user?.role === 'Collector' || user?.role === 'Commissioner' || user?.role === 'collector' || user?.role === 'commissioner';

  return (
    <div className="space-y-6">
      
      {/* Directive dispatch console */}
      <Card>
        <Card.Header>
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Directive Dispatch Console
          </Card.Title>
        </Card.Header>
        <Card.Body className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Issue coordinate waiver commands or dispatch compliance notifications with formal statutory reasoning. Under Rule 14.3 of Business SOPs, executing Collector overrides will auto-clear the dependency interlocks.
          </p>
          
          <Textarea
            label="Administrative Reasoning"
            id="admin-reasoning"
            rows={3}
            placeholder="Enter formal regulatory or engineering justification..."
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            disabled={isExecuting || !isBlocked}
          />

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="primary"
              onClick={() => handleAction('authorize')}
              loading={isExecuting}
              disabled={!isBlocked || !isAuthorizedRole}
            >
              Issue Administrative Directive NOC
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAction('escalate')}
              loading={isExecuting}
              disabled={!isBlocked}
            >
              Escalate to State Secretary
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleAction('defer')}
              loading={isExecuting}
              disabled={!isBlocked}
            >
              Defer Action
            </Button>
          </div>

          {!isAuthorizedRole && (
            <p className="text-[10px] text-amber-700 font-semibold flex items-center gap-1.5 bg-amber-50 border border-amber-100 p-2 rounded-lg leading-normal">
              ⚠️ Signature waiver authority is restricted to District Collector or Municipal Commissioner roles. Lower roles can only escalate blocks.
            </p>
          )}
        </Card.Body>
      </Card>

      {/* Policy Compliance Auditor */}
      <Card>
        <Card.Header>
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Brain size={14} className="text-blue-900" />
            Policy Compliance Auditor (RAG Circular Review)
          </Card.Title>
        </Card.Header>
        <Card.Body className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Query and compare state land circulars, compensation codes, and shifting guidelines against the active interlock details.
          </p>
          <Button
            onClick={handleRunAudit}
            loading={isReviewing}
            disabled={!isBlocked}
            icon={Play}
          >
            Execute Compliance Verification
          </Button>

          {auditResult && (
            <Card status="approved" className="mt-4 border border-emerald-100 bg-emerald-50/10">
              <Card.Header className="bg-emerald-50/30 border-b border-emerald-100 flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-emerald-800 tracking-wider">
                  SENTINEL COMPLIANCE REPORT
                </span>
                <Badge variant="approved">VERIFIED {auditResult.complianceScore}% MATCH</Badge>
              </Card.Header>
              <Card.Body className="space-y-3">
                <div className="bg-white border border-emerald-200/60 rounded-lg p-3">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest block">
                    Authorized Legal Precedent
                  </span>
                  <p className="text-xs font-bold text-blue-900 mt-1 leading-snug">
                    {auditResult.recommendation}
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-mono whitespace-pre-wrap bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  {auditResult.summary}
                </p>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
