import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

// Seeded details for local extension since backend has no direct individual project detail endpoint
const STATIC_PROJECTS_DETAIL = {
  proj_mp_nagar: {
    id: 'proj_mp_nagar',
    name: 'MP Nagar Road Widening',
    description: 'Arterial road widening at Zone 1 and 2 to decongest school and commercial traffic.',
    budget: 14.5, // in Cr
    dailyIdleBurn: 80000,
    penaltyValue: 23000000,
    penaltyActivationDate: '2025-07-15T00:00:00.000Z',
    timeline: [
      { milestone: 'Survey & Alignment Approval', date: 'Jan 2025', status: 'completed' },
      { milestone: 'Land Compensation Clearance', date: 'Apr 2025', status: 'pending' },
      { milestone: 'Asphalt Paving & Road Widening', date: 'Jul 2025', status: 'blocked' },
      { milestone: 'Utility Corridor Shifting', date: 'Aug 2025', status: 'pending' },
    ],
    documents: [
      { name: 'MP Nagar Road Widening DPR.pdf', size: '4.2 MB', uploader: 'PWD' },
      { name: 'Commercial Land Valuation Report.xlsx', size: '1.8 MB', uploader: 'Revenue' },
    ]
  },
  proj_aiims: {
    id: 'proj_aiims',
    name: 'AIIMS Pipeline Upgrade',
    description: 'New water main pipeline laying serving the AIIMS hospital corridor.',
    budget: 3.5, // in Cr
    dailyIdleBurn: 25000,
    penaltyValue: 5000000,
    penaltyActivationDate: '2025-07-25T00:00:00.000Z',
    timeline: [
      { milestone: 'Excavation & sub-surface alignment', date: 'Feb 2025', status: 'blocked' },
      { milestone: 'Main pipeline diversion connection', date: 'May 2025', status: 'pending' },
      { milestone: 'Hospital Corridor restoration', date: 'Sep 2025', status: 'pending' },
    ],
    documents: [
      { name: 'AIIMS Pipeline Feasibility study.pdf', size: '3.1 MB', uploader: 'Water Dept' },
    ]
  },
  proj_kolar: {
    id: 'proj_kolar',
    name: 'Kolar Road Utility Relocation',
    description: 'Relocation of high-voltage transmission poles and drainage lines along the Kolar corridor.',
    budget: 5.2, // in Cr
    dailyIdleBurn: 40000,
    penaltyValue: 8000000,
    penaltyActivationDate: '2025-07-07T00:00:00.000Z',
    timeline: [
      { milestone: 'Pole Shifting Clearances', date: 'Mar 2025', status: 'pending' },
      { milestone: 'Corridor road foundation laying', date: 'Jun 2025', status: 'blocked' },
      { milestone: 'Storm-drain widening construction', date: 'Oct 2025', status: 'pending' },
    ],
    documents: [
      { name: 'Kolar Transmission Lines Blueprint.dwg', size: '8.4 MB', uploader: 'Energy Dept' },
    ]
  }
};

export function useProjects() {
  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });

  const decisionsQuery = useQuery({
    queryKey: ['decisions'],
    queryFn: () => api.getActiveDecisions(),
  });

  const citizenImpactQuery = useQuery({
    queryKey: ['citizen-impact'],
    queryFn: () => api.getCitizenImpact(),
  });

  const projects = [];

  if (dashboardQuery.data) {
    const { activeProjects = [], blockedProjects = [] } = dashboardQuery.data;
    [...activeProjects, ...blockedProjects].forEach(p => {
      const staticDetail = STATIC_PROJECTS_DETAIL[p.id] || {};
      const projectDecisions = decisionsQuery.data?.filter(d => d.project === p.name) || [];
      const projectImpacts = citizenImpactQuery.data?.impacts?.filter(i => i.project === p.name) || [];
      const totalCitizensAffected = projectImpacts.reduce((sum, imp) => sum + imp.citizensAffected, 0);

      projects.push({
        ...p,
        ...staticDetail,
        status: blockedProjects.some(bp => bp.id === p.id) ? 'blocked' : 'on_track',
        decisions: projectDecisions,
        impacts: projectImpacts,
        citizensAffected: totalCitizensAffected,
      });
    });
  }

  return {
    projects,
    loading: dashboardQuery.isLoading || decisionsQuery.isLoading || citizenImpactQuery.isLoading,
    getProjectById: (id) => projects.find(p => p.id === id),
  };
}
