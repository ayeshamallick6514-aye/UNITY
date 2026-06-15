const express = require('express');
const router = express.Router();

const {
  getDashboardData,
  getBriefSummary,
  getAttentionPriorities,
  getActiveDecisions,
  getDependencyMatrix,
  getBottlenecks,
  getCitizenImpactData,
  getEventLog,
  executeDecisionAction,
  getCostExposureData
} = require('../controllers/mainController');

const { simulateRippleDelay } = require('../controllers/rippleController');

// Main dashboard consolidated endpoint
router.get('/dashboard', getDashboardData);

// Summary brief endpoint
router.get('/brief/summary', getBriefSummary);

// Attention panel priorities list
router.get('/alerts/priorities', getAttentionPriorities);

// Decisions board active items
router.get('/decisions/active', getActiveDecisions);

// Cross-tabulation dependency matrix grid
router.get('/matrix/grid', getDependencyMatrix);

// Bottleneck Index gauges
router.get('/bottlenecks/index', getBottlenecks);

// Citizen impact totals
router.get('/impact/citizens', getCitizenImpactData);

// Log audit events
router.get('/events', getEventLog);

// Decision action executions (Escalate/Defer/Authorize)
router.post('/decisions/action', executeDecisionAction);

// Cost exposure calculations
router.get('/cost/exposure', getCostExposureData);

// Cascade ripple simulation
router.get('/cascade/simulate', simulateRippleDelay);
router.post('/cascade/simulate', simulateRippleDelay);

module.exports = router;
