import React from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import { FileText, Database } from 'lucide-react';

export default function SentinelHistoryPanel({ history }) {
  const docs = history?.documents || [];

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between w-full">
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Active Knowledge Base
          </Card.Title>
          <Badge variant="approved">{docs.length} Documents Indexed</Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {docs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Database}
              title="No Documents Indexed"
              description="No regulatory documents have been indexed into the knowledge base. Use the Knowledge Ingest tab to add policy circulars."
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {docs.map((doc, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-blue-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{doc.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Type: {doc.documentType} · Source: {doc.source}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                  Indexed
                </span>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
