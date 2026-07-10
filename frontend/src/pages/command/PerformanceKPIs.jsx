import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import EmptyState from '../../components/ui/EmptyState';
import { Building2, TrendingUp } from 'lucide-react';

export default function PerformanceKPIs() {
  const { data: bottlenecks, isLoading } = useQuery({
    queryKey: ['bottlenecks'],
    queryFn: () => api.getBottlenecks()
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto font-sans text-slate-800">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Performance KPI Registry
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Departmental bottleneck risk rankings and active block indicators under UNITY Bhopal
          </p>
        </div>
      </div>

      {/* Bottleneck Index Card */}
      <Card>
        <Card.Header className="bg-slate-50/50">
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Departmental Bottleneck Indices
          </Card.Title>
        </Card.Header>
        <Card.Body className="divide-y divide-slate-100">
          {!bottlenecks?.length ? (
            <EmptyState
              icon={Building2}
              title="No Bottleneck Data"
              description="No departmental bottleneck data is available yet."
            />
          ) : (
            bottlenecks.map(dept => {
              const score = dept.score || 0;
              const color = score > 70 ? 'red' : score > 40 ? 'amber' : 'emerald';
              const badgeVariant = score > 70 ? 'critical' : score > 40 ? 'high' : 'approved';

              return (
                <div
                  key={dept.departmentId}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-800">{dept.name}</span>
                      <Badge variant={badgeVariant}>{score}%</Badge>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex gap-3 pl-5">
                      <span>Active Blocks: {dept.activeBlocks}</span>
                      <span>Delayed Projects: {dept.delayedProjects}</span>
                    </div>
                  </div>
                  <div className="w-full sm:w-48 shrink-0">
                    <Progress value={score} max={100} color={color} showValue />
                  </div>
                </div>
              );
            })
          )}
        </Card.Body>
      </Card>

    </div>
  );
}
