'use strict';

/**
 * healthcare.js — Healthcare Services & Medical Grievance Routes
 * Mounted at: /api/v1/healthcare/*
 */

const express = require('express');
const router  = express.Router();

const {
  getHealthcareTelemetry,
  reportHealthGrievance,
  trackHealthGrievance,
} = require('../controllers/healthcareController');

// GET  /api/v1/healthcare/telemetry
router.get('/telemetry', getHealthcareTelemetry);

// POST /api/v1/healthcare/grievance
router.post('/grievance', reportHealthGrievance);

// GET  /api/v1/healthcare/track/:refId
router.get('/track/:refId', trackHealthGrievance);

module.exports = router;
