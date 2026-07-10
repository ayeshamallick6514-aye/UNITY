import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Layers, Landmark, Clock } from 'lucide-react';

export default function NearbyProjects() {
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active Projects Near You</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Public works infrastructure monitored under Bhopal district transparency initiatives
        </p>
      </div>

      {/* ─── List ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {projects.map(p => (
          <Card key={p.id} status={p.status === 'blocked' ? 'high' : 'approved'}>
            <Card.Header className="py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-900">{p.name}</span>
                <Badge variant={p.status === 'blocked' ? 'high' : 'approved'}>
                  {p.status === 'blocked' ? 'Delayed' : 'Active'}
                </Badge>
              </div>
              <span className="text-[10px] font-mono text-gray-400">₹{p.budget} Cr Capital</span>
            </Card.Header>
            <Card.Body className="text-xs text-gray-500 py-3 space-y-2 leading-relaxed">
              <p>{p.description}</p>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-md flex flex-wrap gap-4 font-mono text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><Landmark size={12} /> Target Delay Penalty: ₹{(p.penaltyValue/10000000).toFixed(1)} Cr</span>
                <span className="flex items-center gap-1"><Clock size={12} /> Stalled duration: {p.status === 'blocked' ? '47 days' : 'Nominal'}</span>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
