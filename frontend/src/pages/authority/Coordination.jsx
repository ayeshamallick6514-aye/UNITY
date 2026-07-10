import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useAllCRI } from '../../hooks/useCRI';
import { useDashboard } from '../../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Progress from '../../components/ui/Progress';
import {
  GitBranch, Search, AlertTriangle, CheckCircle2, Activity,
  Building2, Layers, Zap, TrendingUp, ArrowRight,
  RefreshCw, ChevronRight, Users, ShieldCheck
} from 'lucide-react';

const ENGINE_STEPS = [
  { id: 1, label: 'Project Ingestion',        desc: 'New infrastructure request logged',           icon: Layers,        group: 'Ingest'     },
  { id: 2, label: 'Scope Analysis',           desc: 'Metadata parsing & district validation',      icon: Search,        group: 'Ingest'     },
  { id: 3, label: 'Department Mapping',       desc: 'Auto-identify department stakeholders',       icon: Building2,     group: 'Analysis'   },
  { id: 4, label: 'Dependency Discovery',     desc: 'Extract inter-departmental task interlocks',  icon: GitBranch,     group: 'Analysis'   },
  { id: 5, label: 'Conflict Detection',       desc: 'Flag circular dependencies & delay risks',    icon: AlertTriangle, group: 'Analysis'   },
  { id: 6, label: 'CRI Index Calculation',    desc: 'Evaluate coordination readiness score',       icon: Activity,      group: 'Evaluation' },
  { id: 7, label: 'Task Assignment',          desc: 'Generate task cards for department officers', icon: Users,         group: 'Execution'  },
  { id: 8, label: 'Sentinel AI Briefing',     desc: 'Assemble executive compliance brief',         icon: ShieldCheck,   group: 'Execution'  },
  { id: 9, label: 'Alert Stakeholders',       desc: 'Nudge nodal officers via SMS/UNITY console',  icon: Activity,      group: 'Execution'  },
  { id: 10, label: 'SLA Tracking & Escalation', desc: 'Monitor days overdue, elevate bottlenecks', icon: TrendingUp,   group: 'Execution'  },
];

export default function Coordination() {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useProjects();
  const { projects: criProjects, loading: criLoading } = useAllCRI();
  const { brief } = useDashboard();

  const [runningStep, setRunningStep]     = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isRunning, setIsRunning]         = useState(false);

  const handleRunEngine = async () => {
    setIsRunning(true);
    setCompletedSteps([]);
    for (let i = 1; i <= 10; i++) {
      setRunningStep(i);
      await new Promise(r => setTimeout(r, 380));
      setCompletedSteps(prev => [...prev, i]);
    }
    setRunningStep(null);
    setIsRunning(false);
  };

  const loading = projectsLoading || criLoading;

  const enrichedProjects = criProjects.length > 0
    ? criProjects
    : (projects || []).map(p => ({
        id: p.id,
        name: p.name,
        cri: p.status === 'blocked' ? 28 : 88,
        statusLevel: p.status === 'blocked' ? 'critical' : 'ready',
        blockedTasks: p.decisions?.length || 0,
        maxStallDays: p.decisions?.[0]?.daysPending || 0
      }));

  const criticalCount  = enrichedProjects.filter(p => p.statusLevel === 'critical').length;
  const moderateCount  = enrichedProjects.filter(p => p.statusLevel === 'moderate').length;
  const readyCount     = enrichedProjects.filter(p => p.statusLevel === 'ready').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={15} className="text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Sentinel Coordination Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time visual pipeline of UNITY's interdepartmental coordination workflow parser
          </p>
        </div>
        <Button
          onClick={handleRunEngine}
          disabled={isRunning}
          variant="primary"
        >
          {isRunning
            ? <><RefreshCw size={12} className="animate-spin mr-1" />Executing Pipeline...</>
            : <><Zap size={12} className="mr-1" />Execute Pipeline Analysis</>
          }
        </Button>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Stalled Projects</span>
          <p className="text-2xl font-black text-red-600 font-mono">{criticalCount}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Moderate Risk</span>
          <p className="text-2xl font-black text-amber-600 font-mono">{moderateCount}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Operational Ready</span>
          <p className="text-2xl font-black text-emerald-600 font-mono">{readyCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* Left: 10-Step Pipeline Flowchart */}
        <div className="xl:col-span-1">
          <Card>
            <Card.Header className="bg-slate-50/50">
              <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Engine Execution Stages
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="relative">
                {/* Connector line */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-200" />
                <div className="space-y-2 relative z-10">
                  {ENGINE_STEPS.map((step) => {
                    const isDone   = completedSteps.includes(step.id);
                    const isActive = runningStep === step.id;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-start gap-3 p-2 rounded-lg border transition-all duration-150 ${
                          isActive ? 'bg-blue-50/40 border-blue-200/80 shadow-sm'
                          : isDone  ? 'bg-slate-50 border-slate-200/40'
                                    : 'bg-white border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-all ${
                          isDone   ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isActive ? 'bg-white border-blue-800 text-blue-800 animate-pulse'
                                     : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {isDone ? '✓' : step.id}
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className={`text-xs font-bold leading-tight ${
                            isDone   ? 'text-slate-400 line-through decoration-slate-200'
                            : isActive ? 'text-blue-900'
                                       : 'text-slate-700'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Right: CRI Heatmap Registry */}
        <div className="xl:col-span-2">
          <Card>
            <Card.Header className="bg-slate-50/50">
              <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
                CRI Heatmap Registry
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="p-6 text-center text-xs text-slate-400">Loading registry...</div>
                ) : (
                  enrichedProjects.map(p => {
                    const isCritical  = p.statusLevel === 'critical';
                    const isModerate  = p.statusLevel === 'moderate';
                    const barColor    = isCritical ? 'red' : isModerate ? 'amber' : 'emerald';
                    const badgeClass  = isCritical
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : isModerate
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                    return (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/authority/projects/${p.id}`)}
                        className="p-4 hover:bg-slate-50/40 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-900 transition-colors">
                              {p.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                              {p.maxStallDays}d stalled · {p.blockedTasks} blockage{p.blockedTasks !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${badgeClass}`}>
                              {isCritical ? 'Critical' : isModerate ? 'Moderate' : 'Ready'}
                            </span>
                            <span className="text-lg font-black font-mono text-slate-800 w-8 text-right">
                              {p.cri}
                            </span>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                          </div>
                        </div>
                        <Progress value={p.cri} max={100} color={barColor} />
                      </div>
                    );
                  })
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

      </div>
    </div>
  );
}
