import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export default function CRIWidget({ cri, compact = false }) {
  if (!cri) {
    return (
      <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-5">
        <div className="h-28 bg-slate-100 rounded" />
      </div>
    );
  }

  const { totalCRI = 0, status = 'Unknown', statusLevel = 'critical', dimensions = {} } = cri;

  // Determine colors based on statusLevel
  const ringColor = 
    statusLevel === 'critical' ? '#EF4444' : 
    statusLevel === 'moderate' ? '#F59E0B' : 
    '#10B981';

  const bgColor = 
    statusLevel === 'critical' ? 'bg-red-50/50' : 
    statusLevel === 'moderate' ? 'bg-amber-50/50' : 
    'bg-emerald-50/50';

  const borderColor = 
    statusLevel === 'critical' ? 'border-red-200' : 
    statusLevel === 'moderate' ? 'border-amber-200' : 
    'border-emerald-200';

  const textColor = 
    statusLevel === 'critical' ? 'text-red-700' : 
    statusLevel === 'moderate' ? 'text-amber-700' : 
    'text-emerald-700';

  const statusLabel = 
    statusLevel === 'critical' ? 'Critical Halt' : 
    statusLevel === 'moderate' ? 'Moderate Risk' : 
    'Operational Ready';

  // SVG configuration (Circle radius: 36, circumference = 2 * pi * 36 ≈ 226.19)
  const radius = 36;
  const strokeWidth = 8;
  const circum = 2 * Math.PI * radius;
  const dashOffset = circum * (1 - totalCRI / 100);

  const dimList = Object.values(dimensions);

  function getDimColor(score, max) {
    const r = score / max;
    if (r < 0.4) return { bar: 'bg-red-500', text: 'text-red-600 font-bold' };
    if (r < 0.75) return { bar: 'bg-amber-500', text: 'text-amber-600 font-bold' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-600 font-bold' };
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 px-3 py-2 border rounded-xl ${bgColor} ${borderColor} shadow-sm animate-fade-in`}>
        <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
          <svg width="40" height="40" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
            <circle
              cx="45" cy="45" r={radius} fill="none"
              stroke={ringColor} strokeWidth={strokeWidth}
              strokeDasharray={circum}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
            <text x="45" y="51" textAnchor="middle" fontSize="18" fontWeight="800" fill={ringColor} fontFamily="monospace">{totalCRI}</text>
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">CRI Score</span>
          <p className={`text-xs font-bold ${textColor} leading-tight mt-0.5`}>{statusLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-fade-in font-sans">
      
      {/* Title Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Coordination Readiness Index (CRI)</h3>
          <p className="text-[10px] text-slate-400">Aggregated interdepartmental verification matrix score</p>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${bgColor} ${borderColor} ${textColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
        
        {/* Radial Progress Block */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg width="112" height="112" viewBox="0 0 90 90">
              {/* Outer soft ring */}
              <circle cx="45" cy="45" r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
              {/* Filled Ring */}
              <circle
                cx="45" cy="45" r={radius} fill="none"
                stroke={ringColor} strokeWidth={strokeWidth}
                strokeDasharray={circum}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 45 45)"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              {/* Core Text */}
              <text x="45" y="44" textAnchor="middle" fontSize="20" fontWeight="900" fill={ringColor} fontFamily="monospace">{totalCRI}</text>
              <text x="45" y="56" textAnchor="middle" fontSize="7" fontWeight="600" fill="#94A3B8" uppercase tracking-wider>INDEX</text>
            </svg>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">
            Bhopal pilot metrics
          </span>
        </div>

        {/* 5 Dimensions Grid */}
        <div className="flex-1 w-full space-y-3">
          {dimList.map((dim) => {
            const colors = getDimColor(dim.score, dim.max);
            const fillPct = (dim.score / dim.max) * 100;
            return (
              <div key={dim.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{dim.label}</span>
                  <span className={`font-mono text-xs ${colors.text}`}>{dim.score} / {dim.max}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Structured Interpretation Summary */}
      <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-[10px] text-slate-500 leading-relaxed">
        <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">State Interpretation Guideline</span>
        {statusLevel === 'critical' && 'CRITICAL LIMIT: Project milestones are blocked by unresolved inter-department issues. Immediate Administrative Directive NOC required from District Collector.'}
        {statusLevel === 'moderate' && 'WARN STATUS: Minor coordinate friction detected. System recommends sending automated nudges to departmental nodal officers.'}
        {statusLevel === 'ready' && 'NOMINAL STATUS: Project coordination requirements are satisfied. The executing agency (PWD) is cleared to progress.'}
      </div>

    </div>
  );
}
