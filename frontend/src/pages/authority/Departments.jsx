import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Building2, User, Phone, TrendingUp, Shield } from 'lucide-react';

export default function Departments() {
  const { data: bottlenecks, isLoading } = useQuery({
    queryKey: ['bottlenecks'],
    queryFn: () => api.getBottlenecks()
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-slate-100 min-h-screen">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-44 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans bg-slate-100 min-h-screen text-slate-900">
      
      {/* ─── Institutional Header ─────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              ZONE: BHOPAL_METRO_01
            </span>
            <span className="text-[9px] font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              MUNICIPAL_DIRECTORY_REGISTRY
            </span>
          </div>
          <h2 className="text-base font-black text-slate-900 tracking-tight uppercase mt-1">
            Department Directory &amp; Bottleneck Index Registry
          </h2>
          <p className="text-xs text-slate-500">
            Connected municipal stakeholder units and interdepartmental risk indices under UNITY Bhopal
          </p>
        </div>
      </div>

      {/* ─── Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bottlenecks?.map(dept => {
          const score = dept.score || 0;
          const status = score > 70 ? 'critical' : score > 40 ? 'high' : 'low';
          const label = score > 70 ? 'High Risk' : score > 40 ? 'Moderate' : 'Nominal';

          return (
            <div key={dept.departmentId} className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden flex flex-col justify-between">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-slate-500" />
                  <span className="text-xs font-black uppercase text-slate-900">{dept.name}</span>
                </div>
                <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  status === 'critical'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : status === 'high'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  Index: {score}% ({label})
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1">
                {/* Score Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-500 uppercase">
                    <span>BOTTLENECK EXPOSURE INDEX</span>
                    <span>{score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        status === 'critical' ? 'bg-red-600' : status === 'high' ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

                {/* Nodal info */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200 rounded p-3">
                  <div>
                    <span className="text-[8.5px] text-slate-400 uppercase font-bold block mb-0.5">NODAL DESK TOKEN</span>
                    <p className="font-bold text-slate-800 text-[11px] font-mono">{dept.nodalOfficer || '[ROLE: NODAL_OFFICER]'}</p>
                  </div>
                  <div>
                    <span className="text-[8.5px] text-slate-400 uppercase font-bold block mb-0.5">SECURE CONTACT</span>
                    <p className="font-mono text-slate-600 text-[11px]">{dept.contact || '+91-755-2540100'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span>ACTIVE BLOCKS: <strong className="text-slate-800">{dept.activeBlocks || 0}</strong></span>
                <span>FINANCIAL EXPOSURE: <strong className="text-red-700">₹{(dept.exposureValue/10000000).toFixed(1)} Cr</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
