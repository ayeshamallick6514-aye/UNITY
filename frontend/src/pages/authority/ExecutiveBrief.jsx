import React, { useState } from 'react';
import { useSentinel } from '../../hooks/useSentinel';
import Tabs from '../../components/ui/Tabs';
import { Search, Database, History, ShieldCheck } from 'lucide-react';

// Sentinel sub-panels
import SentinelSearchPanel  from './components/SentinelSearchPanel';
import SentinelIngestPanel  from './components/SentinelIngestPanel';
import SentinelHistoryPanel from './components/SentinelHistoryPanel';
import { synthesizeClientSentinelPolicy } from '../../components/shared/SentinelAssistantModal';

/**
 * Parser helper to extract structured sections from standard Government Decision Briefings.
 * Exported so it can be re-used by command/AIRecommendations and other screens.
 */
export function parseBriefingSummary(summaryText) {
  if (!summaryText) return null;

  const sections = {
    assessment: '', rootCause: '', operationalRisk: '', affectedDepts: '',
    citizenImpact: '', projectedDelay: '', financialExposure: '',
    recommendedIntervention: '', priority: '', confidence: '',
    cascadeAnalysis: '', noActionTaken: ''
  };

  const extract = (text, startKeyword, endKeywords) => {
    const startIndex = text.indexOf(startKeyword);
    if (startIndex === -1) return '';
    const contentStart = startIndex + startKeyword.length;
    let minEnd = text.length;
    for (const ek of endKeywords) {
      const idx = text.indexOf(ek, contentStart);
      if (idx !== -1 && idx < minEnd) minEnd = idx;
    }
    return text.substring(contentStart, minEnd).trim();
  };

  const bounds = [
    'Assessment:', '1. ROOT CAUSE:', '2. OPERATIONAL RISK:', 'Risk Level:',
    '3. AFFECTED DEPARTMENTS:', '4. CITIZEN IMPACT:', '5. PROJECTED DELAY:',
    '6. FINANCIAL EXPOSURE:', '7. RECOMMENDED INTERVENTION:',
    '7. RECOMMENDED INTERVENTION / Executive Action Required:',
    'Executive Action Required:', '8. EXECUTIVE PRIORITY:', '9. CONFIDENCE SCORE:',
    'CASCADE EFFECT ANALYSIS', 'IF NO ACTION IS TAKEN'
  ];

  sections.assessment            = extract(summaryText, 'Assessment:', bounds);
  sections.rootCause             = extract(summaryText, '1. ROOT CAUSE:', bounds);
  sections.operationalRisk       = extract(summaryText, '2. OPERATIONAL RISK:', bounds);
  sections.affectedDepts         = extract(summaryText, '3. AFFECTED DEPARTMENTS:', bounds);
  sections.citizenImpact         = extract(summaryText, '4. CITIZEN IMPACT:', bounds);
  sections.projectedDelay        = extract(summaryText, '5. PROJECTED DELAY:', bounds);
  sections.financialExposure     = extract(summaryText, '6. FINANCIAL EXPOSURE:', bounds);
  sections.recommendedIntervention =
    extract(summaryText, '7. RECOMMENDED INTERVENTION / Executive Action Required:', bounds) ||
    extract(summaryText, '7. RECOMMENDED INTERVENTION:', bounds) ||
    extract(summaryText, 'Executive Action Required:', bounds);
  sections.priority              = extract(summaryText, '8. EXECUTIVE PRIORITY:', bounds);
  sections.confidence            = extract(summaryText, '9. CONFIDENCE SCORE:', bounds);
  sections.cascadeAnalysis       = extract(summaryText, 'CASCADE EFFECT ANALYSIS', ['IF NO ACTION IS TAKEN']);
  sections.noActionTaken         = extract(summaryText, 'IF NO ACTION IS TAKEN', []);

  if (!sections.rootCause && !sections.citizenImpact && !sections.assessment) return null;
  return sections;
}

const TABS = [
  { id: 'search',  label: 'Search Policies',    icon: Search   },
  { id: 'ingest',  label: 'Knowledge Ingest',   icon: Database },
  { id: 'history', label: 'Audit Logs',         icon: History  },
];

export default function ExecutiveBrief() {
  const { history, runQuery, runIngest, isQuerying, isIngesting } = useSentinel();
  const [activeTab, setActiveTab] = useState('search');

  // Search state
  const [queryText, setQueryText]     = useState('');
  const [queryResult, setQueryResult] = useState(null);

  // Ingest state
  const [docTitle, setDocTitle]           = useState('');
  const [docSource, setDocSource]         = useState('');
  const [docContent, setDocContent]       = useState('');
  const [ingestSuccess, setIngestSuccess] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    try {
      const res = await runQuery(queryText);
      setQueryResult(res);
    } catch (err) {
      console.warn('[Executive Brief] Sentinel query fallback:', err);
      const fallback = synthesizeClientSentinelPolicy(queryText);
      setQueryResult({
        confidence: fallback.confidence,
        response: fallback.text,
        citations: fallback.citations,
      });
    }
  };

  const handleIngestSubmit = async (e) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;
    try {
      await runIngest({
        title: docTitle,
        source: docSource || 'UNITY Internal Upload',
        department: 'Revenue Dept',
        documentType: 'Circular',
        content: docContent
      });
      setIngestSuccess(true);
      setDocTitle(''); setDocSource(''); setDocContent('');
      setTimeout(() => setIngestSuccess(false), 3000);
    } catch {
      alert('Document ingestion failed.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto font-sans text-slate-800">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={16} className="text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Sentinel Briefing Room
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Verify regulatory compliance or search Bhopal circulars using UNITY Sentinel decision intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-blue-950 text-blue-400 border border-blue-900 px-3 py-1 rounded-lg shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          SENTINEL ACTIVE
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div>
        {activeTab === 'search' && (
          <SentinelSearchPanel
            queryText={queryText}
            setQueryText={setQueryText}
            queryResult={queryResult}
            isQuerying={isQuerying}
            onSubmit={handleSearchSubmit}
          />
        )}
        {activeTab === 'ingest' && (
          <SentinelIngestPanel
            docTitle={docTitle}
            setDocTitle={setDocTitle}
            docSource={docSource}
            setDocSource={setDocSource}
            docContent={docContent}
            setDocContent={setDocContent}
            ingestSuccess={ingestSuccess}
            isIngesting={isIngesting}
            onSubmit={handleIngestSubmit}
          />
        )}
        {activeTab === 'history' && (
          <SentinelHistoryPanel history={history} />
        )}
      </div>
    </div>
  );
}
