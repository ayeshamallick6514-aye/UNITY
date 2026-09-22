import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, X, Send, BookOpen, AlertCircle, CheckCircle2,
  Cpu, FileText, CornerDownRight, RotateCcw, Loader2,
  ExternalLink, Building2
} from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const SAMPLE_PROMPTS = [
  'What is the statutory timeline for MPEB utility shifting under BMC Act Section 142?',
  'What delay liquidated damages apply to PWD road contracts over Rs 10 Cr?',
  'When is the District Collector mandated to convene a 48-hour Joint Clearance Session?',
  'What emergency shutdown procedures apply for 33KV power line relocation in AIIMS corridor?',
];

export default function SentinelAssistantModal({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm_init',
      sender: 'system',
      roleTag: '[SYSTEM: SENTINEL_RAG_V2.1]',
      text: 'Assessment: Decision Intelligence & Policy RAG interface initialized for District Administration Bhopal. Enter queries regarding municipal bylaws, Public Works Department manuals, or statutory utility shifting timelines.',
      citations: [
        'Bhopal Municipal Corporation Act (1956) - Sec 142',
        'MP PWD Works Manual (2020) - Clause 18.4',
        'GoMP UDHD Administrative Directives (2024)'
      ],
      confidence: 94.2,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const roleLabel = user?.role ? `[ROLE: ${user.role.toUpperCase()}]` : '[ROLE: DISTRICT_COLLECTOR]';

  const handleSend = async (textToSend) => {
    const promptText = textToSend || query;
    if (!promptText.trim() || loading) return;

    setError('');
    const userMsgId = `u_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      roleTag: roleLabel,
      text: promptText.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.sentinelQuery(promptText.trim());
      const sysMsgId = `s_${Date.now()}`;
      const sysMsg = {
        id: sysMsgId,
        sender: 'system',
        roleTag: res.meta?.roleToken || '[SYSTEM: SENTINEL_RAG_V2.1]',
        text: res.response || 'No policy record found matching requested criteria.',
        citations: res.citations || [],
        confidence: res.confidence || 88.0,
        chunks: res.retrievedChunks || [],
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
      };
      setMessages(prev => [...prev, sysMsg]);
    } catch (err) {
      console.error('[Sentinel Modal Error]', err);
      setError(err.message || 'Failed to query Sentinel Policy engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'm_init_' + Date.now(),
        sender: 'system',
        roleTag: '[SYSTEM: SENTINEL_RAG_V2.1]',
        text: 'Session history reset. Ready for municipal policy queries.',
        citations: ['MP Administrative Manual'],
        confidence: 94.2,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans animate-fade-in select-none">
      
      {/* ── Modal Container ─────────────────────────────────────────── */}
      <div className="w-full max-w-4xl bg-white border border-slate-300 rounded-md shadow-2xl flex flex-col h-[85vh] max-h-[720px] overflow-hidden">
        
        {/* ── Header Band ───────────────────────────────────────────── */}
        <div className="bg-[#0B1B3D] text-white px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-[#162444]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 border border-white/20 rounded flex items-center justify-center text-amber-400">
              <Shield size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] leading-none">
                  UNITY SENTINEL // POLICY RAG ASSISTANT
                </h2>
                <span className="text-[9px] font-mono font-bold bg-white/15 px-2 py-0.5 rounded text-slate-200">
                  v2.1
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono mt-1">
                Grounded in Bhopal Municipal Corporation Act, MP PWD Code &amp; State Administrative Bylaws
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearHistory}
              title="Reset session dialogue"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors text-[10px] font-mono flex items-center gap-1"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <div className="w-px h-5 bg-white/20" />
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Secondary Jurisdiction Strip ─────────────────────────── */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 flex items-center justify-between text-[9px] font-mono text-slate-600 shrink-0">
          <div className="flex items-center gap-3">
            <span>ZONE: <strong>BHOPAL_METRO_01</strong></span>
            <span>•</span>
            <span>KB: <strong>5 MUNICIPAL ACTS &amp; BYLAWS LOADED</strong></span>
            <span>•</span>
            <span>STATUS: <strong className="text-emerald-700">RAG_ONLINE (94.2%)</strong></span>
          </div>
          <div>
            <span>ACTIVE: <strong>{roleLabel}</strong></span>
          </div>
        </div>

        {/* ── Chat Messages Feed ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-100">
          
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Role Header */}
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                  m.sender === 'user' ? 'text-blue-900' : 'text-slate-700'
                }`}>
                  {m.roleTag}
                </span>
                <span className="text-[9px] font-mono text-slate-400">{m.timestamp}</span>
              </div>

              {/* Message Bubble Box */}
              <div className={`max-w-3xl rounded border p-4 shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-white border-blue-200 text-slate-900'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}>
                
                {/* Content */}
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                  {m.text}
                </div>

                {/* Citations Box (System Only) */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <BookOpen size={10} className="text-[#0B1B3D]" />
                        Statutory Regulatory Citations
                      </span>
                      {m.confidence && (
                        <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                          CONFIDENCE: {m.confidence}%
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.citations.map((c, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9px] font-mono"
                        >
                          § {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chunks Context Excerpts (Optional) */}
                {m.chunks && m.chunks.length > 0 && (
                  <div className="mt-2 text-[9px] font-mono text-slate-500 bg-slate-50 border border-slate-200 p-2 rounded">
                    <span className="font-bold text-slate-700 block uppercase mb-0.5">Matched Municipal Record:</span>
                    {m.chunks[0].title} — {m.chunks[0].excerpt}
                  </div>
                )}

              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-700">
                  [SYSTEM: SENTINEL_RAG_V2.1]
                </span>
              </div>
              <div className="bg-white border border-slate-300 rounded p-3.5 shadow-2xs flex items-center gap-3 text-xs text-slate-700">
                <Loader2 size={16} className="animate-spin text-[#0B1B3D]" />
                <span>Retrieving municipal bylaws &amp; synthesizing compliance directive...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Grounded Query Fast-Select Strip ───────────────────────── */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested Queries:
          </span>
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="text-[9px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded whitespace-nowrap transition-colors font-medium text-left"
            >
              {p}
            </button>
          ))}
        </div>

        {/* ── Input Box & Action Bar ─────────────────────────────────── */}
        <div className="bg-white border-t border-slate-300 p-3.5 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              placeholder="Query municipal codes, PWD clauses, utility shifting SLAs, or delay penalty terms..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#0B1B3D] font-sans"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-[#0B1B3D] hover:bg-[#162444] disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
            >
              <Send size={12} />
              Query Sentinel
            </button>
          </form>
          <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 mt-2 px-1">
            <span>GROUNDED SEARCH: MONGODB VECTOR ATLAS // RELEVANCE THRESHOLD: 0.82</span>
            <span>GOVERNMENT OF MADHYA PRADESH • BHOPAL DISTRICT</span>
          </div>
        </div>

      </div>

    </div>
  );
}
