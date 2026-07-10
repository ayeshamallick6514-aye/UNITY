import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import KPIBlock from '../../components/ui/KPIBlock';
import { Building2, User, Phone, TrendingUp } from 'lucide-react';

export default function Departments() {
  const { data: bottlenecks, isLoading } = useQuery({
    queryKey: ['bottlenecks'],
    queryFn: () => api.getBottlenecks()
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-44 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Departments Directory</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Connected departmental units and bottleneck performance indices under UNITY Bhopal
        </p>
      </div>

      {/* ─── Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bottlenecks?.map(dept => {
          const score = dept.score || 0;
          const status = score > 70 ? 'critical' : score > 40 ? 'high' : 'low';
          const label = score > 70 ? 'High Risk' : score > 40 ? 'Moderate' : 'Nominal';

          return (
            <Card key={dept.departmentId} status={status} className="flex flex-col justify-between">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-900">{dept.name}</span>
                </div>
                <Badge variant={status}>
                  Index: {score}% ({label})
                </Badge>
              </Card.Header>

              <Card.Body className="space-y-4 py-3 flex-1">
                {/* Score Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">BOTTLENECK INDEX</span>
                    <span className="font-bold text-gray-900 font-mono">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status === 'critical' ? 'bg-red-500' : status === 'high' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

                {/* Nodal info */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 border border-gray-100 rounded-md p-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">NODAL OFFICER</span>
                    <p className="font-semibold text-gray-700">{dept.nodalOfficer || 'Shri N. Officer'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">CONTACT</span>
                    <p className="font-mono text-gray-500">{dept.contact || '+91-999-999-9999'}</p>
                  </div>
                </div>
              </Card.Body>

              <Card.Footer className="bg-gray-50/50 justify-between text-xs">
                <span className="text-[10px] text-gray-400 font-mono">ACTIVE BLOCKS: {dept.activeBlocks || 0}</span>
                <span className="text-[10px] text-gray-400 font-mono">EXPOSURE: ₹{(dept.exposureValue/10000000).toFixed(1)} Cr</span>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
