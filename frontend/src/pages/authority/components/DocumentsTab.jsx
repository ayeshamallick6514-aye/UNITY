import React from 'react';
import { FileText } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function DocumentsTab({ project }) {
  const handleDownload = (name) => {
    alert(`Initiating download for document: ${name}`);
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
          DPR &amp; Engineering Documents
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="divide-y divide-slate-100">
          {project.documents?.map((doc, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                  <FileText size={15} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {doc.size} · Uploaded by {doc.uploader}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-bold"
                onClick={() => handleDownload(doc.name)}
              >
                Download DPR
              </Button>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
