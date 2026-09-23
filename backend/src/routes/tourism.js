'use strict';

/**
 * tourism.js — Tourism & Heritage Asset Routes
 * Mounted at: /api/v1/tourism/*
 */

const express = require('express');
const router  = express.Router();

const {
  getTourismTelemetry,
  reportTourismGrievance,
  trackTourismGrievance,
} = require('../controllers/transportTourismRuralController');

// GET  /api/v1/tourism/telemetry
router.get('/telemetry', getTourismTelemetry);

// POST /api/v1/tourism/grievance
router.post('/grievance', reportTourismGrievance);

// GET  /api/v1/tourism/track/:refId
router.get('/track/:refId', trackTourismGrievance);

module.exports = router;
