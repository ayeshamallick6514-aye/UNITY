import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Alert from '../../../components/ui/Alert';
import { Database } from 'lucide-react';

export default function SentinelIngestPanel({
  docTitle,
  setDocTitle,
  docSource,
  setDocSource,
  docContent,
  setDocContent,
  ingestSuccess,
  isIngesting,
  onSubmit,
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Index Directive Into RAG Knowledge Base
        </Card.Title>
      </Card.Header>
      <form onSubmit={onSubmit}>
        <Card.Body className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Index new circulars, administrative orders, and guidelines into the policy vector database. Documents are chunked, embedded, and made available for Sentinel reasoning.
          </p>

          {ingestSuccess && (
            <Alert variant="success" title="Document Indexed">
              Document successfully chunked, embedded, and indexed into the knowledge base.
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Document Title"
              id="doc-title"
              required
              placeholder="e.g. Bhopal Drainage Clearance SOP 2026"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              disabled={isIngesting}
            />
            <Input
              label="Source Reference"
              id="doc-source"
              placeholder="e.g. Circular Order MP-92.4"
              value={docSource}
              onChange={(e) => setDocSource(e.target.value)}
              disabled={isIngesting}
            />
          </div>

          <Textarea
            label="Paste Policy Content (Plain Text)"
            id="doc-content"
            rows={6}
            placeholder="Clearance guidelines, regulatory milestones, penalty waiver rules..."
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            disabled={isIngesting}
            required
          />
        </Card.Body>
        <Card.Footer>
          <Button type="submit" loading={isIngesting} icon={Database}>
            Ingest Into Sentinel Database
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
}
