import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Activity, Server, Database, Globe, CheckCircle2 } from 'lucide-react';

const SYSTEMS = [
  { name: 'Revenue Dept Database Sync',          status: 'online', type: 'DB',  latency: '42ms'  },
  { name: 'PWD Project Tracking API',            status: 'online', type: 'API', latency: '12ms'  },
  { name: 'MPEB Utility GIS Layer',              status: 'online', type: 'GIS', latency: '98ms'  },
  { name: 'Water Resources Pipeline Feed',       status: 'online', type: 'DB',  latency: '35ms'  },
  { name: 'Traffic Police Road Closures REST',   status: 'online', type: 'API', latency: '18ms'  },
];

const LATENCY_COLOR = (ms) => {
  const n = parseInt(ms);
  if (n < 30) return 'text-emerald-600';
  if (n < 70) return 'text-amber-600';
  return 'text-red-600';
};

export default function SystemHealth() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto font-sans text-slate-800">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={15} className="text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              System Health &amp; Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Connection status and latency metrics for connected departmental databases and GIS systems
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-900 px-3 py-1 rounded-lg shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ALL SYSTEMS NOMINAL
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <Server size={18} />
          </div>
          <div className="text-xs">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Backend Status</span>
            <span className="font-black text-emerald-700">OPERATIONAL</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <Database size={18} />
          </div>
          <div className="text-xs">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">DB Connections</span>
            <span className="font-black text-blue-700">5 ACTIVE ENDPOINTS</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <Globe size={18} />
          </div>
          <div className="text-xs">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Integration Uptime</span>
            <span className="font-black text-emerald-700">99.8% PASSING</span>
          </div>
        </div>
      </div>

      {/* Integration Feed */}
      <Card>
        <Card.Header className="bg-slate-50/50">
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Departmental Integrations
          </Card.Title>
        </Card.Header>
        <Card.Body className="divide-y divide-slate-100 p-0">
          {SYSTEMS.map((sys, idx) => (
            <div key={idx} className="px-5 py-4 flex items-center justify-between text-xs hover:bg-slate-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">{sys.name}</p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Category: {sys.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold text-[11px] ${LATENCY_COLOR(sys.latency)}`}>
                  {sys.latency}
                </span>
                <Badge variant="approved">Online</Badge>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>

    </div>
  );
}
