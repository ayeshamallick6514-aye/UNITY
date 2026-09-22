'use strict';

/**
 * cLockEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Coordination Lock (C-Lock) State Engine for Bhopal Infrastructure Projects.
 *
 * DEFINITION:
 * C-Lock is the mandatory synchronization state where physical ground execution
 * remains LOCKED (Red/Amber) until ALL stakeholder departments (PWD, Water,
 * Energy, Traffic, Revenue) digitally verify and clear their dependencies.
 *
 * Once 100% of departmental sign-offs are logged, the system transitions to
 * 'C-LOCK RELEASED' (Emerald), authorizing ground mobilization.
 */

const Project    = require('../models/Project');
const Task       = require('../models/Task');
const Dependency = require('../models/Dependency');
const Department = require('../models/Department');

// ─── Default Bhopal stakeholder department matrix per work package ───────────
const DEFAULT_DEPARTMENT_CHECKLIST = {
  proj_mp_nagar: [
    { code: 'revenue',      name: 'Revenue Department, GoMP',            status: 'BLOCKED',  stage: 'PENALTY_IMMINENT', daysPending: 47, verifiedBy: null, token: null },
    { code: 'pwd',          name: 'MP Public Works Dept (PWD)',          status: 'CLEARED',  stage: 'VERIFIED',         daysPending: 0,  verifiedBy: '[ROLE: SE_PWD_BHOPAL]', token: 'PWD-BPL-CLR-8812' },
    { code: 'traffic',      name: 'Bhopal Traffic Police Cell',          status: 'CLEARED',  stage: 'VERIFIED',         daysPending: 0,  verifiedBy: '[ROLE: ACP_TRAFFIC_BPL]', token: 'TRF-BPL-NOC-4401' },
    { code: 'water_supply', name: 'BMC Water Supply Division',           status: 'CLEARED',  stage: 'VERIFIED',         daysPending: 0,  verifiedBy: '[ROLE: EE_WATER_BMC]', token: 'BMC-WTR-NOC-9021' },
  ],
  proj_aiims: [
    { code: 'energy',       name: 'MP Poorv Kshetra Vidyut Vitaran',     status: 'BLOCKED',  stage: 'AWAITING_NOC',     daysPending: 8,  verifiedBy: null, token: null },
    { code: 'water_supply', name: 'BMC Water Supply Division',           status: 'IN_REVIEW',stage: 'DOCS_PENDING',     daysPending: 6,  verifiedBy: null, token: null },
    { code: 'pwd',          name: 'MP Public Works Dept (PWD)',          status: 'CLEARED',  stage: 'VERIFIED',         daysPending: 0,  verifiedBy: '[ROLE: EE_PWD_ZONE_2]', token: 'PWD-BPL-NOC-3104' },
    { code: 'bscdc',        name: 'Bhopal Smart City Development Corp',  status: 'CLEARED',  stage: 'VERIFIED',         daysPending: 0,  verifiedBy: '[ROLE: GM_SMART_CITY]', token: 'BSC-BPL-NOC-1029' },
  ],
  proj_kolar: [
    { code: 'energy',       name: 'MP Poorv Kshetra Vidyut Vitaran',     status: 'BLOCKED',  stage: 'IN_REVIEW',        daysPending: 19, verifiedBy: null, token: null },
    { code: 'pwd',          name: 'MP Public Works Dept (PWD)',          status: 'IN_REVIEW',stage: 'CIVIL_DUCTING',    daysPending: 14, verifiedBy: null, token: null },
    { code: 'traffic',      name: 'Bhopal Traffic Police Cell',          status: 'CLEARED',  stage: 'VERIFIED',         daysPending: 0,  verifiedBy: '[ROLE: ACP_TRAFFIC_BPL]', token: 'TRF-BPL-NOC-7723' },
    { code: 'telecom',      name: 'BSNL / Fiber Coordination Cell',      status: 'CLEARED',  stage: 'VERIFIED',         daysPending: 0,  verifiedBy: '[ROLE: DGM_BSNL_BPL]', token: 'TEL-BPL-NOC-5509' },
  ],
};

// In-memory state store for live sign-off updates during evaluation session
const _liveSignOffs = new Map();

function _getProjectSignOffs(projectId) {
  if (!_liveSignOffs.has(projectId)) {
    const initial = DEFAULT_DEPARTMENT_CHECKLIST[projectId] || [
      { code: 'pwd',          name: 'MP Public Works Dept (PWD)',       status: 'CLEARED', stage: 'VERIFIED', daysPending: 0, verifiedBy: '[ROLE: SE_PWD]', token: 'PWD-AUTO-01' },
      { code: 'water_supply', name: 'BMC Water Supply Division',        status: 'BLOCKED', stage: 'AWAITING_NOC', daysPending: 5, verifiedBy: null, token: null },
      { code: 'energy',       name: 'MP Poorv Kshetra Vidyut Vitaran',  status: 'CLEARED', stage: 'VERIFIED', daysPending: 0, verifiedBy: '[ROLE: EE_MPEB]', token: 'MPEB-AUTO-02' },
      { code: 'traffic',      name: 'Bhopal Traffic Police Cell',       status: 'CLEARED', stage: 'VERIFIED', daysPending: 0, verifiedBy: '[ROLE: ACP_TRAFFIC]', token: 'TRF-AUTO-03' },
    ];
    // Deep clone to allow mutations
    _liveSignOffs.set(projectId, JSON.parse(JSON.stringify(initial)));
  }
  return _liveSignOffs.get(projectId);
}

/**
 * calculateProjectCLock(projectId)
 * Computes the aggregate C-Lock synchronization state for a single project.
 */
async function calculateProjectCLock(projectId) {
  let project = null;
  try {
    project = await Project.findById(projectId);
  } catch {
    // Graceful fallback if project id is string key
  }

  const signOffs = _getProjectSignOffs(projectId);
  const totalDepts = signOffs.length;
  const clearedDepts = signOffs.filter(s => s.status === 'CLEARED').length;
  const blockedDepts = signOffs.filter(s => s.status === 'BLOCKED' || s.status === 'IN_REVIEW');
  const progressPct = totalDepts > 0 ? Math.round((clearedDepts / totalDepts) * 100) : 0;

  const isReleased = clearedDepts === totalDepts;
  const hasCriticalBlock = blockedDepts.some(b => b.daysPending > 20 || b.stage === 'PENALTY_IMMINENT');

  let cLockStatus = 'LOCKED';
  let badgeVariant = 'critical';

  if (isReleased) {
    cLockStatus = 'C-LOCK RELEASED';
    badgeVariant = 'approved';
  } else if (hasCriticalBlock) {
    cLockStatus = 'CRITICAL INTERLOCK';
    badgeVariant = 'critical';
  } else {
    cLockStatus = 'PARTIAL COORDINATION LOCK';
    badgeVariant = 'high';
  }

  const maxStalledDays = signOffs.reduce((max, s) => Math.max(max, s.daysPending || 0), 0);

  return {
    projectId,
    projectName: project?.name || (
      projectId === 'proj_mp_nagar' ? 'MP Nagar Road Widening' :
      projectId === 'proj_aiims'    ? 'AIIMS Pipeline Upgrade' :
      projectId === 'proj_kolar'    ? 'Kolar Road Utility Relocation' : 'Bhopal Civic Infrastructure Work'
    ),
    cLockStatus,
    badgeVariant,
    isReleased,
    progress: {
      total: totalDepts,
      cleared: clearedDepts,
      pending: totalDepts - clearedDepts,
      percentage: progressPct,
    },
    maxStalledDays,
    dailyIdleBurn: project?.dailyIdleBurn || (
      projectId === 'proj_mp_nagar' ? 80000 :
      projectId === 'proj_aiims'    ? 25000 :
      projectId === 'proj_kolar'    ? 40000 : 35000
    ),
    signOffs,
    blockingAgencies: blockedDepts.map(b => ({
      code:        b.code,
      name:        b.name,
      stage:       b.stage,
      daysPending: b.daysPending
    })),
    lastSync: new Date().toISOString(),
    zone: 'BHOPAL_METRO_ZONE_01',
  };
}

/**
 * getAllProjectsCLock()
 * Aggregates C-Lock synchronization across all major Bhopal work packages.
 */
async function getAllProjectsCLock() {
  const projectIds = ['proj_mp_nagar', 'proj_aiims', 'proj_kolar'];
  const results = [];

  for (const pid of projectIds) {
    const cLock = await calculateProjectCLock(pid);
    results.push(cLock);
  }

  const totalProjects = results.length;
  const releasedCount = results.filter(r => r.isReleased).length;
  const lockedCount = totalProjects - releasedCount;
  const overallSyncPct = Math.round(
    results.reduce((acc, r) => acc + r.progress.percentage, 0) / (totalProjects || 1)
  );

  return {
    summary: {
      totalProjects,
      releasedCount,
      lockedCount,
      overallSyncPct,
      systemState: lockedCount === 0 ? 'ALL_CLEAR' : 'INTERLOCKS_ACTIVE',
    },
    projects: results,
    zone: 'BHOPAL_METRO_ZONE_01',
    timestamp: new Date().toISOString(),
  };
}

/**
 * logDepartmentSignOff(projectId, deptCode, authorityRole, referenceNote)
 * Grants departmental verification, clears the department's dependency,
 * and re-evaluates master C-Lock state.
 */
async function logDepartmentSignOff(projectId, deptCode, authorityRole = '[ROLE: DISTRICT_COLLECTOR]', referenceNote = '') {
  const signOffs = _getProjectSignOffs(projectId);
  const target = signOffs.find(s => s.code.toLowerCase() === deptCode.toLowerCase());

  if (!target) {
    throw new Error(`Department code "${deptCode}" not found in project ${projectId} C-Lock checklist.`);
  }

  target.status      = 'CLEARED';
  target.stage       = 'VERIFIED';
  target.daysPending = 0;
  target.verifiedBy  = authorityRole;
  target.token       = `NOC-${deptCode.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  target.note        = referenceNote || 'Sign-off ratified under statutory administrative delegation.';
  target.clearedAt   = new Date().toISOString();

  // Re-calculate updated state
  const updatedState = await calculateProjectCLock(projectId);
  return {
    success: true,
    message: `Department "${target.name}" cleared successfully.`,
    token: target.token,
    updatedProjectState: updatedState,
  };
}

/**
 * resetCLockStore() — For test suites and reset actions
 */
function resetCLockStore() {
  _liveSignOffs.clear();
}

module.exports = {
  calculateProjectCLock,
  getAllProjectsCLock,
  logDepartmentSignOff,
  resetCLockStore
};
