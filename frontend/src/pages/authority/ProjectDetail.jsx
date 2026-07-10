import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useDecisions } from '../../hooks/useDecisions';
import { useSentinel } from '../../hooks/useSentinel';
import { useCRI } from '../../hooks/useCRI';
import useAuthStore from '../../store/authStore';
import Badge from '../../components/ui/Badge';
import { ArrowLeft } from 'lucide-react';

// Refactored Sub-Tab Components
import OverviewTab     from './components/OverviewTab';
import CRITab         from './components/CRITab';
import MilestonesTab   from './components/MilestonesTab';
import DependenciesTab from './components/DependenciesTab';
import CoordinationTab from './components/CoordinationTab';
import FinancialTab    from './components/FinancialTab';
import ApprovalsTab    from './components/ApprovalsTab';
import DocumentsTab    from './components/DocumentsTab';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getProjectById, loading: projectsLoading } = useProjects();
  const { executeAction, isExecuting } = useDecisions();
  const { runReview, isReviewing } = useSentinel();
  const { cri, loading: criLoading } = useCRI(id);

  const [activeTab, setActiveTab] = useState('overview');
  const [actionReason, setActionReason] = useState('');
  const [auditResult, setAuditResult] = useState(null);

  const project = getProjectById(id);

  if (projectsLoading || criLoading || !project) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const activeBlock = project.decisions?.[0];
  const isBlocked = project.status === 'blocked';

  const handleAction = async (action) => {
    if (!activeBlock) return;
    try {
      await executeAction({
        dependencyId: activeBlock.id,
        action,
        reason: actionReason || `Directive issued for ${project.name}`
      });
      setActionReason('');
      alert(`Directive successfully submitted with action: ${action.toUpperCase()}`);
      navigate('/authority/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to submit directive.');
    }
  };

  const handleRunAudit = async () => {
    if (!activeBlock) return;
    try {
      let decisionKey = 'dc1';
      if (project.name.includes('AIIMS')) decisionKey = 'dc2';
      else if (project.name.includes('Kolar')) decisionKey = 'dc3';

      const res = await runReview({ dependencyId: activeBlock.id, decisionKey });
      setAuditResult(res);
    } catch (err) {
      alert('Failed to audit project compliance.');
    }
  };

  // Structured brief details
  const briefData = isBlocked && activeBlock ? {
    situation: `Immediate work stoppage at ${project.name} corridor. The executing agency (PWD) is blocked awaiting external clearance.`,
    rootCause: `Compensation NOC or utility relocation permit is held by ${activeBlock.blockingDept}. Delay duration: ${activeBlock.daysPending} days.`,
    departmentsWaiting: `Public Works Dept (PWD) is waiting on ${activeBlock.blockingDept}.`,
    predictedDelay: `Projected delay is 14 days, creating accumulated municipal losses.`,
    citizenImpact: project.name.includes('AIIMS') 
      ? 'Critical water supply outage risks at AIIMS Bhopal medical corridor. High citizen alert active.'
      : project.name.includes('Kolar')
      ? 'Emergency ambulance corridor route blockage. 1,200 citizens affected daily.'
      : 'School transit corridor width reduced by 40%. Extreme traffic congestion at Zone 1/2.',
    recommendation: `Collector to override block by executing conditional NOC waiver under MP Land Circular rules.`,
    priority: activeBlock.daysPending > 10 ? 'CRITICAL' : 'HIGH',
    deadline: '48 Hours from issuance',
    confidence: '96% Vector Match',
    nextBestAction: 'Go to approvals console, execute "Issue Directive NOC" with administrative reasoning.'
  } : null;

  const tabs = [
    { id: 'overview', label: 'Overview & Brief' },
    { id: 'cri', label: 'CRI Readiness' },
    { id: 'timeline', label: 'Milestones' },
    { id: 'dependencies', label: 'Dependencies Flow' },
    { id: 'coordination', label: 'Dept Tasks' },
    { id: 'budget', label: 'Financial Risks' },
    { id: 'approvals', label: 'Approvals Console' },
    { id: 'documents', label: 'DPR & SOP Docs' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/authority/projects"
            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-500 transition-colors bg-white shadow-sm"
            aria-label="Back to Mission Workspace"
          >
            <ArrowLeft size={14} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded uppercase">
                {project.id}
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{project.name}</h2>
              <Badge variant={project.status === 'blocked' ? 'blocked' : 'approved'}>
                {project.status === 'blocked' ? 'Blocked' : 'Nominal'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">Bhopal Smart City Development Pilot Project</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-t-lg shadow-sm border-x" aria-label="Project Workspace Navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all focus:outline-none ${
              activeTab === tab.id
                ? 'border-blue-900 text-blue-900 bg-slate-50/50 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab
            project={project}
            isBlocked={isBlocked}
            activeBlock={activeBlock}
            briefData={briefData}
            cri={cri}
          />
        )}

        {activeTab === 'cri' && (
          <CRITab cri={cri} />
        )}

        {activeTab === 'timeline' && (
          <MilestonesTab project={project} />
        )}

        {activeTab === 'dependencies' && (
          <DependenciesTab cri={cri} />
        )}

        {activeTab === 'coordination' && (
          <CoordinationTab cri={cri} />
        )}

        {activeTab === 'budget' && (
          <FinancialTab project={project} activeBlock={activeBlock} />
        )}

        {activeTab === 'approvals' && (
          <ApprovalsTab
            user={user}
            isBlocked={isBlocked}
            isExecuting={isExecuting}
            isReviewing={isReviewing}
            actionReason={actionReason}
            setActionReason={setActionReason}
            handleAction={handleAction}
            handleRunAudit={handleRunAudit}
            auditResult={auditResult}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsTab project={project} />
        )}
      </div>
    </div>
  );
}
