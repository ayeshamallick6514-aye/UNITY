import React from 'react';
import { AlertTriangle, Brain } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import KPIBlock from '../../../components/ui/KPIBlock';
import CRIWidget from '../../../components/CRIWidget';

export default function OverviewTab({
  project,
  isBlocked,
  activeBlock,
  briefData,
  cri,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Project description card */}
        <Card>
          <Card.Header>
            <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Project Description
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {project.description}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Capital Allocation
                </span>
                <p className="text-xs font-black text-slate-800 font-mono">
                  ₹{project.budget} Cr
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Idle Loss Outflow
                </span>
                <p className="text-xs font-bold text-red-600 font-mono">
                  ₹{project.dailyIdleBurn?.toLocaleString()}/day
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Active conflict notification block */}
        {isBlocked && activeBlock && (
          <Card status="critical">
            <Card.Header className="bg-red-50/40">
              <Card.Title className="text-red-900 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle size={14} /> Active Inter-Agency Blockage
              </Card.Title>
            </Card.Header>
            <Card.Body className="text-xs text-red-800 space-y-2">
              <p className="font-semibold leading-relaxed">{activeBlock.situation}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-mono text-slate-600">
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[9px]">Waiting agency:</span>
                  <span className="font-semibold">{activeBlock.waitingDept}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[9px]">Blocking agency:</span>
                  <span className="font-semibold">{activeBlock.blockingDept}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[9px]">Stalled Duration:</span>
                  <span className="font-semibold text-red-600">{activeBlock.daysPending} days</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Executive briefing style brief card */}
        {briefData && (
          <Card className="border border-blue-200 shadow-sm">
            <Card.Header className="bg-blue-50/40 border-b border-blue-100 flex items-center justify-between">
              <Card.Title className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider">
                <Brain size={14} className="text-blue-700" />
                Sentinel Briefing Report
              </Card.Title>
              <span className="text-[9px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                CONFIDENCE: {briefData.confidence}
              </span>
            </Card.Header>
            <Card.Body className="p-0 overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <tbody>
                  {[
                    { label: 'Situation Outline', val: briefData.situation },
                    { label: 'Departments Waiting', val: briefData.departmentsWaiting },
                    { label: 'Primary Root Cause', val: briefData.rootCause },
                    { label: 'Predicted Delay Impact', val: briefData.predictedDelay },
                    { label: 'Citizen Impact Assessment', val: briefData.citizenImpact },
                    { label: 'Recommended Directive', val: briefData.recommendation },
                    { label: 'Cabinet Priority Level', val: briefData.priority, isBadge: true },
                    { label: 'Compliance Deadline', val: briefData.deadline },
                    { label: 'Next Best Operation', val: briefData.nextBestAction }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-500 w-44 bg-slate-50/10 align-top uppercase text-[10px] tracking-wider border-r border-slate-100">
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-slate-700 leading-relaxed font-sans text-xs">
                        {row.isBadge ? (
                          <Badge variant={row.val === 'CRITICAL' ? 'critical' : 'high'}>{row.val}</Badge>
                        ) : row.val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        )}

      </div>

      {/* Sidebar widgets */}
      <div className="space-y-6">
        {cri && <CRIWidget cri={cri} compact={true} />}
        <KPIBlock value={`₹${project.budget} Cr`} label="Approved DPR Budget" color="blue" />
        <KPIBlock
          value={project.status === 'blocked' ? 'CRITICAL HALT' : 'NOMINAL EXECUTION'}
          label="Operational Status"
          color={project.status === 'blocked' ? 'red' : 'emerald'}
        />
      </div>
    </div>
  );
}
