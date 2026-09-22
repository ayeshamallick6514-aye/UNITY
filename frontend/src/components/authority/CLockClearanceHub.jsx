import React, { useState, useEffect } from 'react';
import {
  Lock, Unlock, ShieldCheck, AlertTriangle, CheckCircle2,
  Clock, ArrowRight, RotateCcw, Building2, FileCheck2,
  Cpu, Send, ChevronDown, ChevronUp, Loader2, Sparkles
} from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

export default function CLockClearanceHub() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingDept, setSigningDept] = useState(null); // { projectId, deptCode, deptName }
  const [directiveNote, setDirectiveNote] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [expandedProjects, setExpandedProjects] = useState({
    proj_mp_nagar: true,
    proj_aiims: true,
    proj_kolar: true,
  });

  const loadCLockState = async () => {
    try {
      setLoading(true);
      const res = await api.getCLockProjects();
      setData(res);
    } catch (err) {
      console.error('[C-Lock Hub Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCLockState();
  }, []);

  const handleToggleExpand = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleSignOffSubmit = async (e) => {
    e.preventDefault();
    if (!signingDept) return;

    setIsExecuting(true);
    setActionSuccess('');
    try {
      const role = user?.role ? `[ROLE: ${user.role.toUpperCase()}]` : '[ROLE: DISTRICT_COLLECTOR]';
      const res = await api.signOffDepartment(
        signingDept.projectId,
        signingDept.deptCode,
        role,
        directiveNote || 'Cleared following executive review and compliance verification.'
      );

      setActionSuccess(`Clearance recorded for ${signingDept.deptName}. Token: ${res.token}`);
      setSigningDept(null);
      setDirectiveNote('');
      await loadCLockState();
    } catch (err) {
      alert(err.message || 'Failed to record departmental sign-off.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all C-Lock project clearance states to default evaluation baseline?')) return;
    try {
      await api.resetCLock();
      await loadCLockState();
      setActionSuccess('C-Lock demonstration states reset to baseline.');
    } catch (err) {
      alert(err.message || 'Failed to reset C-Lock states.');
    }
  };

  if (loading && !data) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-8 text-center space-y-3">
        <Loader2 size={24} className="animate-spin text-[#0B1B3D] mx-auto" />
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
          SYNCHRONIZING C-LOCK INTERDEPARTMENTAL STATE ENGINE...
        </p>
      </div>
    );
  }

  const { summary, projects } = data || { summary: {}, projects: [] };

  return (
    <div className="space-y-6 font-sans">

      {/* ── Top Institutional Telemetry Strip ───────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                SYSTEM: C_LOCK_SYNCHRONIZER_V2
              </span>
              <span className="text-[9px] font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                ZONE: BHOPAL_METRO_01
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mt-1 flex items-center gap-2">
              <Lock size={16} className="text-[#0B1B3D]" />
              Coordination Lock (C-Lock) Clearance Console
            </h2>
            <p className="text-xs text-slate-500">
              Mandatory multi-agency synchronization: Ground execution remains locked until 100% of departmental dependencies are verified.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded transition-colors uppercase self-start sm:self-auto"
            title="Reset to baseline"
          >
            <RotateCcw size={11} />
            Reset Baseline
          </button>
        </div>

        {/* 4-Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Active Work Packages</p>
            <p className="text-xl font-black font-mono text-slate-900 mt-0.5">{summary?.totalProjects || 3}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">C-Lock Released</p>
            <p className="text-xl font-black font-mono text-emerald-700 mt-0.5">{summary?.releasedCount || 0}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Interlocks Active</p>
            <p className="text-xl font-black font-mono text-red-700 mt-0.5">{summary?.lockedCount || 3}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Overall Sync Rate</p>
            <p className="text-xl font-black font-mono text-slate-900 mt-0.5">{summary?.overallSyncPct || 0}%</p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded text-xs flex items-center justify-between animate-fade-in font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-900 hover:text-black text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* ── Projects C-Lock Breakdown ────────────────────────────────────── */}
      <div className="space-y-4">
        {projects.map((p) => {
          const isExpanded = expandedProjects[p.projectId] !== false;
          const isFullyReleased = p.isReleased;

          return (
            <div
              key={p.projectId}
              className={`bg-white border rounded-md shadow-2xs overflow-hidden transition-all ${
                isFullyReleased ? 'border-emerald-300' : 'border-slate-200'
              }`}
            >
              {/* Card Header Bar */}
              <div
                onClick={() => handleToggleExpand(p.projectId)}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none ${
                  isFullyReleased ? 'bg-emerald-50/40 border-b border-emerald-100' : 'bg-slate-50/60 border-b border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-white shrink-0 ${
                    isFullyReleased ? 'bg-emerald-700' : 'bg-[#0B1B3D]'
                  }`}>
                    {isFullyReleased ? <Unlock size={16} /> : <Lock size={16} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        {p.projectName}
                      </h3>
                      <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                        isFullyReleased
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : p.badgeVariant === 'critical'
                            ? 'bg-red-100 text-red-900 border-red-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        {p.cLockStatus}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      ID: {p.projectId.toUpperCase()} • Daily Burn Exposure: ₹{(p.dailyIdleBurn).toLocaleString('en-IN')}/day
                    </p>
                  </div>
                </div>

                {/* Progress Mini Bar & Toggle */}
                <div className="flex items-center gap-4">
                  <div className="text-right sm:min-w-[140px]">
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-600 mb-1">
                      <span>NOC PROGRESS</span>
                      <span>{p.progress.cleared}/{p.progress.total} Cleared ({p.progress.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isFullyReleased ? 'bg-emerald-600' : 'bg-[#0B1B3D]'
                        }`}
                        style={{ width: `${p.progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Card Body - Department Checklist Grid */}
              {isExpanded && (
                <div className="p-4 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[8.5px] font-black uppercase tracking-wider">
                          <th className="px-4 py-2.5 text-left">Stakeholder Agency</th>
                          <th className="px-3 py-2.5 text-left">Status</th>
                          <th className="px-3 py-2.5 text-left">Stage / SLA</th>
                          <th className="px-3 py-2.5 text-left">Digital Verification Token</th>
                          <th className="px-4 py-2.5 text-right">Administrative Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {p.signOffs.map((dept) => {
                          const isCleared = dept.status === 'CLEARED';
                          const isBlocked = dept.status === 'BLOCKED';

                          return (
                            <tr key={dept.code} className="hover:bg-slate-50/60 transition-colors">
                              {/* Agency Name */}
                              <td className="px-4 py-3 font-semibold text-slate-800 text-[11px]">
                                <div className="flex items-center gap-2">
                                  <Building2 size={13} className="text-slate-400 shrink-0" />
                                  <span>{dept.name}</span>
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td className="px-3 py-3">
                                <span className={`inline-flex items-center gap-1 text-[8.5px] font-black uppercase px-2 py-0.5 rounded border ${
                                  isCleared
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : isBlocked
                                      ? 'bg-red-50 text-red-800 border-red-200'
                                      : 'bg-blue-50 text-blue-800 border-blue-200'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    isCleared ? 'bg-emerald-600' : isBlocked ? 'bg-red-600' : 'bg-blue-600'
                                  }`} />
                                  {dept.status}
                                </span>
                              </td>

                              {/* Stage / Stalled Days */}
                              <td className="px-3 py-3 font-mono text-[10px] text-slate-600">
                                {isCleared ? (
                                  <span className="text-emerald-700 font-bold">VERIFIED_NOC</span>
                                ) : (
                                  <span className={dept.daysPending > 10 ? 'text-red-700 font-bold' : 'text-slate-700'}>
                                    {dept.stage} ({dept.daysPending}d stalled)
                                  </span>
                                )}
                              </td>

                              {/* Verification Token */}
                              <td className="px-3 py-3 font-mono text-[9px]">
                                {isCleared ? (
                                  <div className="space-y-0.5">
                                    <div className="text-emerald-800 font-bold flex items-center gap-1">
                                      <ShieldCheck size={11} />
                                      {dept.token}
                                    </div>
                                    <div className="text-slate-400">{dept.verifiedBy}</div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">Pending departmental sign-off</span>
                                )}
                              </td>

                              {/* Action Button */}
                              <td className="px-4 py-3 text-right">
                                {isCleared ? (
                                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                                    CLEARED
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => setSigningDept({
                                      projectId: p.projectId,
                                      deptCode: dept.code,
                                      deptName: dept.name,
                                      daysPending: dept.daysPending,
                                      stage: dept.stage,
                                    })}
                                    className="bg-[#0B1B3D] hover:bg-[#162444] text-white text-[9.5px] font-bold px-3 py-1.5 rounded uppercase tracking-wider transition-colors shadow-2xs"
                                  >
                                    Grant Sign-Off
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary / Ground Execution State Notice */}
                  <div className={`p-3 rounded border text-xs flex items-center justify-between ${
                    isFullyReleased
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isFullyReleased ? (
                        <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                      ) : (
                        <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                      )}
                      <span>
                        {isFullyReleased
                          ? 'All stakeholder departments cleared. Physical ground excavation and road works authorized.'
                          : `Physical execution locked. ${p.progress.pending} departmental sign-offs required to release ground works.`}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono uppercase font-bold text-slate-500">
                      C-LOCK PROTOCOL § 14
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Sign-Off Authorization Modal ────────────────────────────────── */}
      {signingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
          <div className="bg-white border border-slate-300 rounded-md shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
            <div className="bg-[#0B1B3D] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 size={16} className="text-amber-400" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Issue C-Lock Clearance Directive
                </h3>
              </div>
              <button
                onClick={() => setSigningDept(null)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSignOffSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Target Department:</p>
                <p className="text-xs font-black text-slate-900">{signingDept.deptName}</p>
                <p className="text-[9px] font-mono text-red-700 mt-1">
                  Current Status: {signingDept.stage} ({signingDept.daysPending} days stalled)
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Administrative Reference / Authority Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={directiveNote}
                  onChange={(e) => setDirectiveNote(e.target.value)}
                  placeholder="e.g. Authorized under Joint Clearance Order MP-2024/09 following inter-agency site inspection..."
                  className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-900 outline-none focus:border-[#0B1B3D] bg-white placeholder:text-slate-400 font-sans"
                />
              </div>

              <div className="bg-blue-50/60 border border-blue-200 p-2.5 rounded text-[9.5px] text-blue-900">
                Ratification by the authorized officer records a permanent digital clearance token in the C-Lock audit trail and recalculates the work package status.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSigningDept(null)}
                  disabled={isExecuting}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExecuting || !directiveNote.trim()}
                  className="bg-[#0B1B3D] hover:bg-[#162444] disabled:opacity-50 text-white font-black px-4 py-2 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Recording Sign-Off...
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      Authorize &amp; Release Lock
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
