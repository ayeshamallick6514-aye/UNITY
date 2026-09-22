'use strict';

/**
 * civic.js — Civic utility routes
 * Mounted at: /api/v1/ocr  and  /api/v1/geo
 */

const express = require('express');
const router  = express.Router();

const { analyzeGrievanceImage, getOcrStatus }          = require('../controllers/ocrController');
const { reverseGeocodePoint, batchGeocodePoints, getWardRegistry } = require('../controllers/geospatialController');

// ─── OCR Routes ───────────────────────────────────────────────────────────────
// POST /api/v1/ocr/analyze   — multipart/form-data, field: "image"
router.post('/ocr/analyze', analyzeGrievanceImage);

// GET  /api/v1/ocr/status    — engine health probe
router.get('/ocr/status', getOcrStatus);

// ─── Geospatial Routes ────────────────────────────────────────────────────────
// GET  /api/v1/geo/reverse?lat=23.2156&lng=77.4100
router.get('/geo/reverse', reverseGeocodePoint);

// POST /api/v1/geo/batch     — body: { "points": [{ lat, lng }] }
router.post('/geo/batch', batchGeocodePoints);

// GET  /api/v1/geo/wards     — full Bhopal ward registry
router.get('/geo/wards', getWardRegistry);

module.exports = router;
