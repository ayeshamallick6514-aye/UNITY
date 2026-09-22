'use strict';

/**
 * geospatialController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * GET  /api/v1/geo/reverse?lat=23.2&lng=77.4
 * POST /api/v1/geo/batch   { "points": [{ lat, lng }, ...] }
 *
 * Uses OpenStreetMap Nominatim for zero-cost reverse geocoding.
 * Resolves to Bhopal municipal ward + C-Lock interlock matrix link.
 */

const { reverseGeocode, batchGeocode } = require('../services/geospatialService');

// ─── GET /api/v1/geo/reverse ──────────────────────────────────────────────────
exports.reverseGeocodePoint = async function reverseGeocodePoint(req, res) {
  const { lat, lng } = req.query;

  if (lat == null || lng == null) {
    return res.status(400).json({
      success: false,
      error:   'MISSING_PARAMS',
      message: 'Query parameters "lat" and "lng" are required. Example: ?lat=23.2156&lng=77.4100',
    });
  }

  try {
    const result = await reverseGeocode(lat, lng);

    return res.json({
      success:    true,
      requestId:  `GEO-${Date.now()}`,
      source:     'OpenStreetMap Nominatim',
      license:    'ODbL — openstreetmap.org/copyright',
      ...result,
      // Institutional metadata for UI display
      meta: {
        zone:        'BHOPAL_METRO_ZONE_01',
        system:      'UNITY Geospatial Validation Engine v2.0',
        resolvedBy:  '[ROLE: GEOSPATIAL_PROCESSOR]',
      },
    });
  } catch (err) {
    const isValidationError = err.message.includes('Invalid') || err.message.includes('out of');
    return res.status(isValidationError ? 400 : 502).json({
      success: false,
      error:   isValidationError ? 'INVALID_COORDINATES' : 'GEOCODE_FAILED',
      message: err.message,
    });
  }
};

// ─── POST /api/v1/geo/batch ───────────────────────────────────────────────────
exports.batchGeocodePoints = async function batchGeocodePoints(req, res) {
  const { points } = req.body ?? {};

  if (!Array.isArray(points) || points.length === 0) {
    return res.status(400).json({
      success: false,
      error:   'MISSING_BODY',
      message: 'Body must contain a "points" array: [{ "lat": number, "lng": number }]',
    });
  }

  if (points.length > 10) {
    return res.status(400).json({
      success: false,
      error:   'BATCH_LIMIT_EXCEEDED',
      message: 'Maximum 10 coordinates per batch request (OSM rate-limit compliance).',
    });
  }

  // Validate each point before queuing
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (typeof p.lat !== 'number' || typeof p.lng !== 'number') {
      return res.status(400).json({
        success: false,
        error:   'INVALID_POINT',
        message: `Point at index ${i} must have numeric "lat" and "lng" fields.`,
      });
    }
  }

  try {
    const results = await batchGeocode(points);

    return res.json({
      success:    true,
      requestId:  `GEO-BATCH-${Date.now()}`,
      source:     'OpenStreetMap Nominatim',
      license:    'ODbL — openstreetmap.org/copyright',
      total:      results.length,
      results,
      meta: {
        zone:       'BHOPAL_METRO_ZONE_01',
        system:     'UNITY Geospatial Validation Engine v2.0',
        resolvedBy: '[ROLE: GEOSPATIAL_PROCESSOR]',
        note:       '1.1s inter-request delay applied to comply with OSM usage policy.',
      },
    });
  } catch (err) {
    return res.status(err.message.includes('limit') ? 400 : 502).json({
      success: false,
      error:   'BATCH_GEOCODE_FAILED',
      message: err.message,
    });
  }
};

// ─── GET /api/v1/geo/wards ────────────────────────────────────────────────────
// Returns the full Bhopal ward registry for map legend / dropdown population
exports.getWardRegistry = function getWardRegistry(_req, res) {
  const registry = [
    { ward: 'WARD_007', name: 'Rani Kamlapati Zone',       dept: 'MP Road Dev. Corp.',          lat: 23.2278, lng: 77.4325 },
    { ward: 'WARD_011', name: 'VIP Road Corridor',         dept: 'MP PWD',                      lat: 23.2449, lng: 77.4032 },
    { ward: 'WARD_019', name: 'DB Mall Junction',          dept: 'Bhopal Municipal Corp.',      lat: 23.2198, lng: 77.4344 },
    { ward: 'WARD_028', name: 'AIIMS Corridor',            dept: 'Bhopal Smart City Dev. Corp.',lat: 23.1999, lng: 77.4580 },
    { ward: 'WARD_031', name: 'Arera Colony',              dept: 'Bhopal Municipal Corp.',      lat: 23.2182, lng: 77.4372 },
    { ward: 'WARD_033', name: 'Hoshangabad Road Corridor', dept: 'MP PWD',                      lat: 23.1845, lng: 77.4256 },
    { ward: 'WARD_042', name: 'MP Nagar Zone-II',          dept: 'MP PWD',                      lat: 23.2334, lng: 77.4280 },
    { ward: 'WARD_055', name: 'Kolar Road',                dept: 'Bhopal Municipal Corp.',      lat: 23.1756, lng: 77.4756 },
    { ward: 'WARD_062', name: 'Shahpura Colony',           dept: 'Bhopal Municipal Corp.',      lat: 23.2612, lng: 77.4189 },
    { ward: 'WARD_071', name: 'Misrod Industrial Area',    dept: 'MP Pollution Control Board',  lat: 23.1598, lng: 77.5102 },
    { ward: 'WARD_082', name: 'Berasia Road',              dept: 'MP PWD',                      lat: 23.3156, lng: 77.4012 },
  ];

  return res.json({
    success: true,
    zone:    'BHOPAL_METRO_ZONE_01',
    total:   registry.length,
    wards:   registry,
    bounds: {
      latMin: 22.90, latMax: 23.50,
      lngMin: 77.20, lngMax: 77.70,
      description: 'Bhopal District administrative boundary',
    },
  });
};
