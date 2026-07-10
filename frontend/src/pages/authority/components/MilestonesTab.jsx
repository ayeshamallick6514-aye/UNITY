import React from 'react';
import Card from '../../../components/ui/Card';

export default function MilestonesTab({ project }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Milestone Timeline Progress
        </Card.Title>
      </Card.Header>
      <Card.Body className="relative pl-6 space-y-6">
        <div className="absolute left-3.5 top-5 bottom-5 w-px bg-slate-200" />
        {project.timeline?.map((milestone, idx) => (
          <div key={idx} className="flex gap-4 relative">
            <div
              className={`w-2 h-2 rounded-full absolute -left-[19px] top-1.5 border-4 shrink-0 ${
                milestone.status === 'completed' ? 'bg-emerald-500 border-emerald-100' :
                milestone.status === 'blocked'   ? 'bg-red-500 border-red-100 animate-pulse' :
                'bg-slate-300 border-slate-100'
              }`}
            />
            <div className="space-y-0.5 text-xs">
              <p
                className={`font-bold ${
                  milestone.status === 'completed' ? 'text-slate-900 line-through decoration-slate-200' :
                  milestone.status === 'blocked'   ? 'text-red-600 font-extrabold' :
                  'text-slate-600'
                }`}
              >
                {milestone.milestone}
              </p>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                {milestone.date} · {milestone.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}
