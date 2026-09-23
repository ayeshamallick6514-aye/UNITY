import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Loader2, Search, FileText, CheckCircle, Clock, AlertCircle, ChevronRight,
} from 'lucide-react';

/* ─── Constants ─────────────────────────────────────────────────────────── */
const STAGES = ['Filed', 'Assigned', 'Under Review', 'Resolved'];

const STATUS_STAGE = {
  REGISTERED: 0,
  FILED: 0,
  ASSIGNED: 1,
  UNDER_REVIEW: 2,
  RESOLVED: 3,
};

const SAMPLE_IDS = ['BPL-COM-88492', 'HLTH-BPL-2026-8812', 'AGR-BPL-2026-1147'];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function statusBadgeClass(status) {
  const s = (status || '').toUpperCase();
  if (s === 'RESOLVED') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (s === 'UNDER_REVIEW' || s === 'ASSIGNED') return 'bg-amber-50 text-amber-700 border border-amber-200';
  return 'bg-slate-100 text-slate-600 border border-slate-200';
}

function stageIndex(status) {
  const s = (status || '').toUpperCase().replace(/ /g, '_');
  return STATUS_STAGE[s] ?? 0;
}

/* ─── Timeline ───────────────────────────────────────────────────────────── */
function Timeline({ status }) {
  const done = stageIndex(status);
  return (
    <div className="pt-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-3">
        Timeline Progress
      </p>
      <div className="flex items-center">
        {STAGES.map((label, i) => {
          const completed = i <= done;
          const lineCompleted = i < done;
          return (
            <React.Fragment key={label}>
              {/* Circle */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold
                    ${completed
                      ? 'bg-[#0B1B3D] border-[#0B1B3D] text-white'
                      : 'border-slate-200 bg-white text-slate-300'
                    }`}
                >
                  {completed ? <CheckCircle size={13} /> : <span>{i + 1}</span>}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 text-center leading-tight w-14">
                  {label}
                </span>
              </div>
              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mb-4 mx-1 ${lineCompleted ? 'bg-[#0B1B3D]' : 'bg-slate-200'}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Result Card ─────────────────────────────────────────────────────────── */
function ResultCard({ item }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-mono font-bold text-slate-700">{item.refId || item.id}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadgeClass(item.status)}`}>
          {(item.status || '').replace(/_/g, ' ')}
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Domain badge + Title */}
        <div className="space-y-1">
          {item.domain && (
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-bold uppercase tracking-wider mb-1">
              {item.domain}
            </span>
          )}
          <h4 className="text-sm font-bold text-slate-800 leading-snug">{item.title}</h4>
          {item.description && (
            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
          )}
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 rounded-lg p-3 text-[10px] font-mono text-slate-500">
          {item.location && <p><span className="font-bold text-slate-600">Location: </span>{item.location}</p>}
          {(item.filedAt || item.date) && (
            <p><span className="font-bold text-slate-600">Filed: </span>{item.filedAt || item.date}</p>
          )}
          {item.assignedTo && (
            <p className="col-span-2"><span className="font-bold text-slate-600">Assigned To: </span>{item.assignedTo}</p>
          )}
        </div>

        {/* 4-stage timeline */}
        <Timeline status={item.status} />
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function TrackComplaint() {
  const navigate = useNavigate();
  const [queryId, setQueryId]         = useState('');
  const [complaints, setComplaints]   = useState([]);
  const [trackedItem, setTrackedItem] = useState(null);
  const [searched, setSearched]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [notFound, setNotFound]       = useState(false);

  /* Load from sessionStorage on mount */
  useEffect(() => {
    try {
      const list = JSON.parse(sessionStorage.getItem('complaints') || '[]');
      setComplaints(Array.isArray(list) ? list : []);
    } catch {
      setComplaints([]);
    }
  }, []);

  /* Search handler — tries API first, falls back to sessionStorage */
  const handleSearch = async (e, directId = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const id = (directId || queryId).trim();
    if (!id) return;
    if (directId) setQueryId(directId);

    setLoading(true);
    setSearched(true);
    setTrackedItem(null);
    setNotFound(false);

    try {
      const res = await api.trackComplaint(id);
      const data = res?.data || res;
      if (data?.success) {
        setTrackedItem(data.complaint || data);
        setLoading(false);
        return;
      }
    } catch (err) {
      // 404 or network failure → fall through to sessionStorage
    }

    /* Fallback: sessionStorage */
    const found = complaints.find(
      (c) => (c.id || c.refId || '').toLowerCase() === id.toLowerCase()
    );
    setTrackedItem(found || null);
    setNotFound(!found);
    setLoading(false);
  };

  /* Click-to-track from the session list */
  const trackFromList = (c) => {
    const cid = c.id || c.refId || '';
    setQueryId(cid);
    handleSearch(null, cid);
  };

  /* Auto-fill sample ID chip and immediately search */
  const fillSample = (id) => {
    setQueryId(id);
    handleSearch(null, id);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Track Your Complaint</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Verify resolution status, department assignments, and updates on your submitted tickets
        </p>
      </div>

      {/* ─── Search Bar ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Ticket Reference ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="e.g. BPL-COM-88492"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 bg-slate-50 focus:outline-none focus:border-[#0B1B3D] focus:bg-white transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0B1B3D] hover:bg-[#162b5e] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading
              ? <Loader2 size={14} className="animate-spin" />
              : <Search size={14} />
            }
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>

      {/* ─── Loading ────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-slate-400 text-xs">
          <Loader2 size={18} className="animate-spin text-[#0B1B3D]" />
          <span>Looking up reference ID…</span>
        </div>
      )}

      {/* ─── Result ─────────────────────────────────────────────────────── */}
      {!loading && searched && trackedItem && (
        <ResultCard item={trackedItem} />
      )}

      {/* ─── Not Found ──────────────────────────────────────────────────── */}
      {!loading && searched && notFound && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-3 shadow-sm">
          <AlertCircle size={28} className="mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No record found</p>
          <p className="text-xs text-slate-400">Try these sample IDs:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SAMPLE_IDS.map((id) => (
              <button
                key={id}
                onClick={() => fillSample(id)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-[#0B1B3D] hover:text-white border border-slate-200 hover:border-[#0B1B3D] text-slate-600 text-[10px] font-mono rounded-full transition-all"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Session Complaints List ─────────────────────────────────────── */}
      {complaints.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Your Submitted Tickets
          </span>
          <div className="space-y-2">
            {complaints.map((c) => (
              <div
                key={c.id || c.refId}
                onClick={() => trackFromList(c)}
                className="bg-white border border-slate-200 hover:border-[#0B1B3D] hover:shadow-sm rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">{c.title}</p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {c.id || c.refId} · {c.date || c.filedAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadgeClass(c.status)}`}>
                    {(c.status || '').replace(/_/g, ' ')}
                  </span>
                  <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
