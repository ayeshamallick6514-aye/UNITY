import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAllCRI } from '../../hooks/useCRI';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import KPIBlock from '../../components/ui/KPIBlock';
import { ShieldAlert, AlertCircle, Building2, Flame, Layers, Activity, Users, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MissionOverview() {
  const navigate = useNavigate();
  const { brief, dashboard, loading: dashboardLoading } = useDashboard();
  const { projects: criProjects, loading: criLoading } = useAllCRI();

  const loading = dashboardLoading || criLoading;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-200 rounded-lg" />)}
        </div>
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  const activeEscalations = dashboard?.criticalAlerts || [];
  const totalExposure = criProjects.reduce((sum, p) => sum + (p.cri < 50 ? p.budget : 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={15} className="text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Mission Control Overview</h2>
          </div>
          <p className="text-xs text-slate-400">Real-time civic monitoring console for Bhopal Smart City pilots</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-red-950 text-red-400 border border-red-900 px-3 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          SYSTEM LIVE
        </div>
      </div>

      {/* KPI Blocks Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIBlock value={criProjects.length || 3} label="Monitored Projects" sublabel="Bhopal Smart City Pilot" color="blue" />
        <KPIBlock value={criProjects.filter(p => p.cri < 50).length} label="Critical CRI Projects" sublabel="CRI index below 50" color="red" />
        <KPIBlock value={brief?.pendingDependenciesCount || 3} label="Pending Interlocks" sublabel="Awaiting clearances" color="amber" />
        <KPIBlock value={`₹${(totalExposure / 10000000).toFixed(1)} Cr`} label="Capital Exposed" sublabel="Blocked project budgets" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: CRI live heatmaps & escalations list */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <Card.Header className="bg-slate-50/50">
              <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">CRI Heatmap Indicators</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="divide-y divide-slate-100">
                {criProjects.map(p => {
                  const isCritical = p.cri < 50;
                  const isModerate = p.cri >= 50 && p.cri < 80;
                  const progressColor = isCritical ? 'bg-red-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500';
                  const badgeStyle = isCritical ? 'bg-red-50 text-red-700 border-red-200' : isModerate ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  
                  return (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/authority/projects/${p.id}`)}
                      className="p-4 hover:bg-slate-50/40 cursor-pointer transition-colors flex flex-col gap-2 group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-900 transition-colors">{p.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{p.maxStallDays}d stalled · {p.blockedTasks} blocked tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${badgeStyle}`}>
                            {isCritical ? 'Critical' : isModerate ? 'Moderate' : 'Ready'}
                          </span>
                          <span className="text-lg font-black font-mono text-slate-800 w-8 text-right">{p.cri}</span>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${p.cri}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          {/* Active Escalation Console */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Flame size={14} className="text-red-500" /> Active Operations Escalations
            </h3>
            <Button variant="ghost" size="sm" className="text-xs font-bold" onClick={() => navigate('/command/escalations')}>
              View Console
            </Button>
          </div>

          <div className="space-y-3">
            {activeEscalations.map(esc => (
              <Card key={esc.id} status="critical" hoverable onClick={() => navigate('/command/escalations')}>
                <Card.Header className="bg-red-50/20 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 font-mono">{esc.project}</span>
                    <Badge variant="critical">HALT</Badge>
                  </div>
                  <span className="text-[10px] font-mono text-red-600 font-semibold flex items-center gap-1">
                    <Clock size={11} /> {esc.daysStalled} Days Overdue
                  </span>
                </Card.Header>
                <Card.Body className="py-2.5 text-xs">
                  <p className="font-semibold text-slate-700 leading-relaxed">{esc.title}</p>
                  <p className="mt-1.5 font-mono text-[10px] text-slate-400">Responsible Unit: {esc.department}</p>
                </Card.Body>
              </Card>
            ))}
          </div>

        </div>

        {/* Right Side: Risk index & citizen impact list */}
        <div className="space-y-6">
          
          <Card>
            <Card.Header className="bg-slate-50/50">
              <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">Unit Bottleneck Rankings</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="divide-y divide-slate-100">
                {(dashboard?.highestRiskDepartments || []).map((dept, idx) => (
                  <div key={dept.id || idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{dept.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">Blocks held: {dept.activeBlocks}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className={`h-full ${dept.score > 70 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${dept.score}%` }} />
                      </div>
                      <Badge variant={dept.score > 70 ? 'critical' : 'high'}>{dept.score}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="bg-slate-50/50">
              <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">Public Service Impact</Card.Title>
            </Card.Header>
            <Card.Body className="p-4 space-y-3 text-xs">
              {[
                { label: 'AIIMS Bhopal Corridor Water Supply', affected: '800 Affected', status: 'critical' },
                { label: 'Kolar Emergency Road Access Corridor', affected: '1,200 Affected', status: 'critical' },
                { label: 'MP Nagar Zone 1/2 Transit Corridor', affected: '2,750 Affected', status: 'critical' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-slate-800 leading-tight">{item.label}</p>
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Bhopal pilot zone</span>
                  </div>
                  <span className="font-mono font-bold text-red-600 text-[11px] shrink-0">{item.affected}</span>
                </div>
              ))}
            </Card.Body>
          </Card>

        </div>

      </div>

    </div>
  );
}
