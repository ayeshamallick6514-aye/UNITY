import React from 'react';
import UnityMap from '../../components/map/UnityMap';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useProjects } from '../../hooks/useProjects';
import { Map, FolderDot } from 'lucide-react';

export default function ProjectMonitoring() {
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden">

      {/* Sidebar — Project Registry */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-100 flex flex-col shrink-0 overflow-hidden">
        
        {/* Sidebar Header */}
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <FolderDot size={14} className="text-blue-900" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Project Monitor
            </h2>
          </div>
          <p className="text-[10px] text-slate-400">
            {projects.length} Bhopal infrastructure project{projects.length !== 1 ? 's' : ''} currently mapped
          </p>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {projects.map(p => {
            const isBlocked = p.status === 'blocked';
            return (
              <Card
                key={p.id}
                status={isBlocked ? 'critical' : 'approved'}
                className="text-xs"
              >
                <Card.Body className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-800 leading-snug truncate">
                      {p.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
                      ₹{p.budget} Cr
                    </span>
                  </div>
                  <p className="text-slate-400 leading-normal line-clamp-2 font-normal">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.ward || 'Bhopal District'}
                    </span>
                    <Badge variant={isBlocked ? 'critical' : 'approved'}>
                      {isBlocked ? 'Blocked' : 'On Track'}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </aside>

      {/* Map Canvas */}
      <div className="flex-1 h-full bg-slate-100">
        <UnityMap activeLayers={['road_projects', 'road_closures']} />
      </div>

    </div>
  );
}
