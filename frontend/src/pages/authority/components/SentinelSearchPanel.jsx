import React from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import Alert from '../../../components/ui/Alert';
import { ShieldCheck } from 'lucide-react';

export default function SentinelSearchPanel({
  queryText,
  setQueryText,
  queryResult,
  isQuerying,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Semantic Policy Query Console
          </Card.Title>
        </Card.Header>
        <form onSubmit={onSubmit}>
          <Card.Body className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Query Bhopal municipal SOPs, MP circular orders, and land acquisition directives using Sentinel policy vector embeddings. Results are synthesized from the indexed knowledge base.
            </p>
            <Textarea
              label="Enter Administrative Query"
              id="sentinel-query"
              rows={3}
              placeholder="e.g. Compensation guidelines for delayed road widening utility relocation..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              disabled={isQuerying}
              required
            />
          </Card.Body>
          <Card.Footer>
            <Button type="submit" loading={isQuerying} icon={ShieldCheck}>
              Query Sentinel Knowledge Base
            </Button>
          </Card.Footer>
        </form>
      </Card>

      {queryResult && (
        <Card status="approved" className="animate-fade-in">
          <Card.Header className="bg-emerald-50/20">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Query Resolution Report
              </span>
              <Badge variant="approved">Confidence {queryResult.confidence}%</Badge>
            </div>
          </Card.Header>
          <Card.Body className="space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {queryResult.response}
            </p>

            {queryResult.citations?.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
                  Source Policy Documents
                </span>
                <div className="space-y-2">
                  {queryResult.citations.map((cite, i) => (
                    <div
                      key={i}
                      className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-600 font-mono"
                    >
                      {cite}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
