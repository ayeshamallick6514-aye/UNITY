'use strict';

/**
 * transport.js — Transport & Fleet Tracking Routes
 * Mounted at: /api/v1/transport/*
 */

const express = require('express');
const router  = express.Router();

const {
  getTransportTelemetry,
  reportTransportGrievance,
  trackTransportGrievance,
} = require('../controllers/transportTourismRuralController');

// GET  /api/v1/transport/telemetry
router.get('/telemetry', getTransportTelemetry);

// POST /api/v1/transport/grievance
router.post('/grievance', reportTransportGrievance);

// GET  /api/v1/transport/track/:refId
router.get('/track/:refId', trackTransportGrievance);

module.exports = router;
