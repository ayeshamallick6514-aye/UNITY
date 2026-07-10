import React from 'react';
import { Building2 } from 'lucide-react';
import Card from '../../../components/ui/Card';

export default function DependenciesTab({ cri }) {
  if (!cri) return null;

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Dependency Diagram Matrix
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-6 space-y-6">
        {cri.dependencyChain?.length === 0 ? (
          <p className="text-center py-6 text-slate-400 text-xs font-medium">
            No inter-departmental dependencies detected.
          </p>
        ) : (
          cri.dependencyChain.map((dep, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-center justify-center gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200/60"
            >
              {/* Blocking side */}
              <div className="w-full md:w-64 p-4 bg-white border border-red-200 rounded-lg shadow-sm border-t-4 border-t-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={13} className="text-red-500" />
                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">
                    Blocking task
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug">{dep.blockingTask}</p>
              </div>

              {/* Connection */}
              <div className="flex flex-col items-center shrink-0 text-red-500">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
                  INTERLOCKS
                </span>
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 font-bold mt-1 text-sm shadow-inner">
                  →
                </div>
                <span className="text-[9px] font-bold uppercase mt-1 tracking-wider bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono">
                  {dep.escalationStatus}
                </span>
              </div>

              {/* Waiting side */}
              <div className="w-full md:w-64 p-4 bg-white border border-slate-200 rounded-lg shadow-sm border-t-4 border-t-blue-900">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={13} className="text-blue-900" />
                  <span className="text-[9px] font-bold text-blue-900 uppercase tracking-wider">
                    Blocked task
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug">{dep.blockedTask}</p>
              </div>
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
}
