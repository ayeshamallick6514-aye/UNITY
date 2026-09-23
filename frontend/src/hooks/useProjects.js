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
  },
  proj_bhopal_metro: {
    id: 'proj_bhopal_metro',
    name: 'Bhopal Metro Orange Line (Subhash Nagar to Karond)',
    description: 'Viaduct pier construction and 33KV high-tension grid relocation along 14.99 km corridor.',
    budget: 215.0, // in Cr
    dailyIdleBurn: 150000,
    penaltyValue: 45000000,
    penaltyActivationDate: '2025-08-01T00:00:00.000Z',
    timeline: [
      { milestone: 'Alignment & Pier Soil Testing', date: 'Jan 2025', status: 'completed' },
      { milestone: '33KV Electrical Grid Shifting', date: 'Apr 2025', status: 'pending' },
      { milestone: 'Viaduct Pier Foundation Casting', date: 'Jul 2025', status: 'blocked' },
      { milestone: 'Metro Station Concourse Civil Works', date: 'Nov 2025', status: 'pending' },
    ],
    documents: [
      { name: 'Bhopal Metro Line-2 Detailed Project Report.pdf', size: '12.6 MB', uploader: 'MPMRCL' },
      { name: 'Subhash Nagar Grid Relocation Clearance.pdf', size: '3.4 MB', uploader: 'Energy Dept' },
    ]
  },
  proj_bhadbhada_flyover: {
    id: 'proj_bhadbhada_flyover',
    name: 'Bhadbhada Junction 4-Lane Flyover',
    description: '1.2 km grade separator construction to eliminate traffic bottleneck at New Market - Kaliasot axis.',
    budget: 85.0, // in Cr
    dailyIdleBurn: 65000,
    penaltyValue: 12000000,
    penaltyActivationDate: '2025-08-15T00:00:00.000Z',
    timeline: [
      { milestone: 'Structural Stability & Geotechnical Survey', date: 'Feb 2025', status: 'completed' },
      { milestone: 'Forest Land & Tree Translocation NOC', date: 'May 2025', status: 'pending' },
      { milestone: 'Girder Launching & Pier Cap Installation', date: 'Aug 2025', status: 'blocked' },
    ],
    documents: [
      { name: 'Bhadbhada Flyover Engineering Blueprint.pdf', size: '6.8 MB', uploader: 'PWD' },
    ]
  },
  proj_hoshangabad_brts: {
    id: 'proj_hoshangabad_brts',
    name: 'Hoshangabad Road Corridor Redesign & Drain Network',
    description: 'Reconstruction of mixed traffic lanes and sub-surface stormwater culvert widening along Misrod corridor.',
    budget: 120.0, // in Cr
    dailyIdleBurn: 90000,
    penaltyValue: 18000000,
    penaltyActivationDate: '2025-09-01T00:00:00.000Z',
    timeline: [
      { milestone: 'Topographic & Traffic Volume Survey', date: 'Feb 2025', status: 'completed' },
      { milestone: 'Underground Ducting & Utility Shifting', date: 'Jun 2025', status: 'pending' },
      { milestone: 'Stormwater Culvert Widening & Paving', date: 'Sep 2025', status: 'blocked' },
    ],
    documents: [
      { name: 'Hoshangabad Corridor Redesign Feasibility.pdf', size: '5.1 MB', uploader: 'BMC' },
    ]
  },
  proj_upper_lake_stp: {
    id: 'proj_upper_lake_stp',
    name: 'Upper Lake Catchment 50 MLD STP Project',
    description: 'Interception and diversion of untreated nullahs entering Bhoj Wetland with SBR technology.',
    budget: 165.0, // in Cr
    dailyIdleBurn: 75000,
    penaltyValue: 28000000,
    penaltyActivationDate: '2025-07-20T00:00:00.000Z',
    timeline: [
      { milestone: 'Wetland Hydrological Impact Study', date: 'Jan 2025', status: 'completed' },
      { milestone: 'MPPCB Environmental Consent to Establish', date: 'May 2025', status: 'pending' },
      { milestone: 'Primary Sedimentation Tank Excavation', date: 'Jul 2025', status: 'blocked' },
      { milestone: 'SBR Basin Electromechanical Installation', date: 'Dec 2025', status: 'pending' },
    ],
    documents: [
      { name: 'Upper Lake Environmental Protection Report.pdf', size: '9.2 MB', uploader: 'EPCO' },
    ]
  },
  proj_hamidia_smart_corridor: {
    id: 'proj_hamidia_smart_corridor',
    name: 'Hamidia Hospital Smart Transit Access Corridor',
    description: 'Pedestrian and emergency ambulance transit spine widening around historic Hamidia Medical Campus.',
    budget: 48.0, // in Cr
    dailyIdleBurn: 45000,
    penaltyValue: 7500000,
    penaltyActivationDate: '2025-07-01T00:00:00.000Z',
    timeline: [
      { milestone: 'Old City Traffic & Encroachment Survey', date: 'Jan 2025', status: 'completed' },
      { milestone: 'Revenue Encroachment Compensation & Right of Way', date: 'Apr 2025', status: 'pending' },
      { milestone: 'Emergency Ambulance Corridor Widening', date: 'Jun 2025', status: 'blocked' },
    ],
    documents: [
      { name: 'Hamidia Emergency Access Plan.pdf', size: '4.5 MB', uploader: 'Smart City' },
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
