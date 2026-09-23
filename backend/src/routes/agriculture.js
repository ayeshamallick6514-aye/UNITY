'use strict';

/**
 * agriculture.js — Agricultural Governance & Farmer Welfare Routes
 * Mounted at: /api/v1/agriculture/*
 */

const express = require('express');
const router  = express.Router();

const {
  getAgricultureTelemetry,
  getFarmerDbtStatus,
  reportCropDamageGrievance,
} = require('../controllers/agricultureController');

// GET  /api/v1/agriculture/telemetry
router.get('/telemetry', getAgricultureTelemetry);

// GET  /api/v1/agriculture/dbt/status/:farmerId
router.get('/dbt/status/:farmerId', getFarmerDbtStatus);

// POST /api/v1/agriculture/crop-damage/report
router.post('/crop-damage/report', reportCropDamageGrievance);

module.exports = router;
