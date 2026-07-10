// ─── Application Constants ────────────────────────────────────────────────────
export const APP_NAME = 'UNITY';
export const APP_FULLNAME = 'Unified Network for Interdepartmental Transparency and Yield';
export const APP_TAGLINE = 'Government Coordination & Decision Intelligence Platform';
export const APP_CITY = 'Bhopal, Madhya Pradesh';
export const APP_VERSION = '2.0.0';

// API base (dynamically resolved to backend Render URL in production)
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Check if we are running on Render static hosting
    if (hostname.includes('onrender.com')) {
      // If the hostname has 'frontend', swap it with 'backend'
      if (hostname.includes('frontend')) {
        const backendHost = hostname.replace('frontend', 'backend');
        return `https://${backendHost}/api/v1`;
      }
      return 'https://unity-backend.onrender.com/api/v1';
    }
  }
  return import.meta.env.VITE_API_URL || '/api/v1';
};

export const API_BASE = getApiBase();

// Session timeout — 30 minutes of inactivity
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

// Map defaults — Bhopal centre
export const MAP_DEFAULT_CENTER = [23.2599, 77.4126];
export const MAP_DEFAULT_ZOOM   = 12;

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = {
  COLLECTOR:       'collector',
  COMMISSIONER:    'commissioner',
  EXEC_ENGINEER:   'executive_engineer',
  DEPT_OFFICER:    'dept_officer',
  NODAL_OFFICER:   'nodal_officer',
  CHIEF_SECRETARY: 'chief_secretary',
  CITIZEN:         'citizen',
  GUEST:           'guest',
};

// Which roles map to which workspace
export const WORKSPACE_BY_ROLE = {
  [ROLES.COLLECTOR]:       'authority',
  [ROLES.COMMISSIONER]:    'authority',
  [ROLES.EXEC_ENGINEER]:   'authority',
  [ROLES.DEPT_OFFICER]:    'authority',
  [ROLES.NODAL_OFFICER]:   'command',
  [ROLES.CHIEF_SECRETARY]: 'command',
  [ROLES.CITIZEN]:         'citizen',
  [ROLES.GUEST]:           'citizen',
};

// ─── Status Definitions ───────────────────────────────────────────────────────
export const STATUS = {
  CRITICAL: 'critical',
  HIGH:     'high',
  MEDIUM:   'medium',
  LOW:      'low',
  APPROVED: 'approved',
  PENDING:  'pending',
  BLOCKED:  'blocked',
  ON_TRACK: 'on_track',
};

// ─── Department Directory ─────────────────────────────────────────────────────
export const DEPARTMENTS = [
  { id: 'revenue',   name: 'Revenue Department',      short: 'Revenue',   color: '#7C3AED' },
  { id: 'pwd',       name: 'Public Works Department',  short: 'PWD',       color: '#2563EB' },
  { id: 'mpeb',      name: 'MP Electricity Board',     short: 'MPEB',      color: '#D97706' },
  { id: 'water',     name: 'Water Resources',          short: 'Water',     color: '#0891B2' },
  { id: 'traffic',   name: 'Traffic Police',           short: 'Traffic',   color: '#059669' },
  { id: 'smart',     name: 'Smart City Mission',       short: 'Smart',     color: '#DC2626' },
  { id: 'telecom',   name: 'Telecom Department',       short: 'Telecom',   color: '#9333EA' },
  { id: 'municipal', name: 'Municipal Corporation',    short: 'Municipal', color: '#EA580C' },
];

// ─── Map Layer Definitions ────────────────────────────────────────────────────
export const MAP_LAYERS = [
  { id: 'road_projects',   label: 'Road Projects',      defaultOn: true  },
  { id: 'utilities',       label: 'Utilities',          defaultOn: true  },
  { id: 'departments',     label: 'Dept. Zones',        defaultOn: false },
  { id: 'complaints',      label: 'Citizen Complaints', defaultOn: false },
  { id: 'traffic',         label: 'Traffic',            defaultOn: true  },
  { id: 'conflict_zones',  label: 'Conflict Zones',     defaultOn: true  },
  { id: 'ward_boundaries', label: 'Ward Boundaries',    defaultOn: true  },
  { id: 'road_closures',   label: 'Road Closures',      defaultOn: true  },
];
