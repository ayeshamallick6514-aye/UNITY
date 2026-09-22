'use strict';

/**
 * cLockController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * HTTP Controller for Coordination Lock (C-Lock) Engine endpoints.
 * Mounts:
 *   GET  /api/v1/clock/projects
 *   GET  /api/v1/clock/project/:id
 *   POST /api/v1/clock/sign-off
 *   POST /api/v1/clock/reset
 */

const {
  calculateProjectCLock,
  getAllProjectsCLock,
  logDepartmentSignOff,
  resetCLockStore
} = require('../services/cLockEngine');

// ─── GET /api/v1/clock/projects ───────────────────────────────────────────────
exports.getAllProjectsCLockState = async function getAllProjectsCLockState(req, res) {
  try {
    const data = await getAllProjectsCLock();
    return res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('[C-Lock Controller] getAllProjects error:', error);
    return res.status(500).json({
      success: false,
      error:   'CLOCK_AGGREGATION_ERROR',
      message: error.message,
    });
  }
};

// ─── GET /api/v1/clock/project/:id ────────────────────────────────────────────
exports.getSingleProjectCLockState = async function getSingleProjectCLockState(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error:   'MISSING_ID',
        message: 'Project ID parameter is required.',
      });
    }

    const data = await calculateProjectCLock(id);
    return res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('[C-Lock Controller] getSingleProject error:', error);
    return res.status(500).json({
      success: false,
      error:   'CLOCK_PROJECT_ERROR',
      message: error.message,
    });
  }
};

// ─── POST /api/v1/clock/sign-off ──────────────────────────────────────────────
exports.executeDepartmentSignOff = async function executeDepartmentSignOff(req, res) {
  try {
    const { projectId, deptCode, authorityRole, referenceNote } = req.body;

    if (!projectId || !deptCode) {
      return res.status(400).json({
        success: false,
        error:   'MISSING_FIELDS',
        message: 'projectId and deptCode are required in request body.',
      });
    }

    const role = authorityRole || req.headers['x-user-role'] || '[ROLE: DISTRICT_COLLECTOR]';
    const result = await logDepartmentSignOff(projectId, deptCode, role, referenceNote);

    return res.json({
      success: true,
      ...result,
      meta: {
        zone:      'BHOPAL_METRO_ZONE_01',
        executor:  role,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('[C-Lock Controller] executeSignOff error:', error);
    return res.status(error.message.includes('not found') ? 404 : 500).json({
      success: false,
      error:   'SIGN_OFF_ERROR',
      message: error.message,
    });
  }
};

// ─── POST /api/v1/clock/reset ─────────────────────────────────────────────────
exports.resetCLockDemoState = function resetCLockDemoState(_req, res) {
  try {
    resetCLockStore();
    return res.json({
      success: true,
      message: 'C-Lock demonstration states reset to baseline.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:   'RESET_ERROR',
      message: error.message,
    });
  }
};
