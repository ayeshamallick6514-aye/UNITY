'use strict';

/**
 * rural.js — Rural Development & Panchayat Governance Routes
 * Mounted at: /api/v1/rural/*
 */

const express = require('express');
const router  = express.Router();

const {
  getRuralTelemetry,
  getPanchayatDetails,
  reportRuralGrievance,
} = require('../controllers/transportTourismRuralController');

// GET  /api/v1/rural/telemetry
router.get('/telemetry', getRuralTelemetry);

// GET  /api/v1/rural/panchayat/:code
router.get('/panchayat/:code', getPanchayatDetails);

// POST /api/v1/rural/grievance
router.post('/grievance', reportRuralGrievance);

module.exports = router;
