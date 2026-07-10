import { ROLES } from './constants';

// ─── Role Configuration ───────────────────────────────────────────────────────
// Defines display metadata and permissions for each role.

export const ROLE_CONFIG = {
  [ROLES.COLLECTOR]: {
    label:       'District Collector',
    workspace:   'authority',
    permissions: ['dashboard', 'projects', 'map', 'departments', 'coordination',
                  'approvals', 'brief', 'analytics', 'settings'],
    canApprove:  true,
    canEscalate: true,
  },
  [ROLES.COMMISSIONER]: {
    label:       'Commissioner',
    workspace:   'authority',
    permissions: ['dashboard', 'projects', 'map', 'departments', 'coordination',
                  'approvals', 'brief', 'analytics', 'settings'],
    canApprove:  true,
    canEscalate: true,
  },
  [ROLES.EXEC_ENGINEER]: {
    label:       'Executive Engineer',
    workspace:   'authority',
    permissions: ['dashboard', 'projects', 'map', 'departments', 'coordination',
                  'approvals', 'brief', 'settings'],
    canApprove:  false,
    canEscalate: true,
  },
  [ROLES.DEPT_OFFICER]: {
    label:       'Department Officer',
    workspace:   'authority',
    permissions: ['dashboard', 'projects', 'map', 'coordination', 'settings'],
    canApprove:  false,
    canEscalate: false,
  },
  [ROLES.NODAL_OFFICER]: {
    label:       'Nodal Officer',
    workspace:   'command',
    permissions: ['overview', 'escalations', 'matrix', 'projects', 'citizens',
                  'funding', 'reports', 'kpis', 'health', 'ai'],
    canApprove:  false,
    canEscalate: true,
  },
  [ROLES.CHIEF_SECRETARY]: {
    label:       'Chief Secretary',
    workspace:   'command',
    permissions: ['overview', 'escalations', 'matrix', 'projects', 'citizens',
                  'funding', 'reports', 'kpis', 'health', 'ai'],
    canApprove:  true,
    canEscalate: true,
  },
  [ROLES.CITIZEN]: {
    label:       'Citizen',
    workspace:   'citizen',
    permissions: ['home', 'report', 'projects', 'schemes', 'track',
                  'notifications', 'profile'],
    canApprove:  false,
    canEscalate: false,
  },
  [ROLES.GUEST]: {
    label:       'Guest',
    workspace:   'citizen',
    permissions: ['home', 'projects', 'schemes'],
    canApprove:  false,
    canEscalate: false,
  },
};

/**
 * Get the role config for a given role key.
 * Falls back to GUEST config if role is unknown.
 */
export function getRoleConfig(role) {
  return ROLE_CONFIG[role] ?? ROLE_CONFIG[ROLES.GUEST];
}

/**
 * Check if a role has permission for a specific feature.
 */
export function hasPermission(role, feature) {
  const config = getRoleConfig(role);
  return config.permissions.includes(feature);
}

/**
 * Determine the home route for a given role.
 */
export function getHomeRoute(role) {
  const config = getRoleConfig(role);
  switch (config.workspace) {
    case 'authority': return '/authority/dashboard';
    case 'command':   return '/command/overview';
    case 'citizen':   return '/citizen/home';
    default:          return '/select-role';
  }
}
