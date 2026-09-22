'use strict';

/**
 * citizen.js — Multi-Domain Citizen Services Routes
 * Mounted at: /api/v1/citizen/*
 */

const express = require('express');
const router  = express.Router();

const {
  getCitizenServicesSummary,
  verifyScholarshipMerit,
  getScholarshipStatus,
  reportEducationGrievance,
  trackRecruitmentRecord,
  reportRecruitmentGrievance,
} = require('../controllers/citizenServiceController');

// ─── Multi-Domain Citizen Endpoints ───────────────────────────────────────────

// GET /api/v1/citizen/services/summary
router.get('/services/summary', getCitizenServicesSummary);

// POST /api/v1/citizen/scholarship/verify
router.post('/scholarship/verify', verifyScholarshipMerit);

// GET /api/v1/citizen/scholarship/status/:appId
router.get('/scholarship/status/:appId', getScholarshipStatus);

// POST /api/v1/citizen/education/report
router.post('/education/report', reportEducationGrievance);

// GET /api/v1/citizen/recruitment/track/:rollNo
router.get('/recruitment/track/:rollNo', trackRecruitmentRecord);

// POST /api/v1/citizen/recruitment/grievance
router.post('/recruitment/grievance', reportRecruitmentGrievance);

module.exports = router;
