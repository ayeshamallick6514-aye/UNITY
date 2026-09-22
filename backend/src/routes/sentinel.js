const express = require('express');
const router = express.Router();

const {
  queryPolicy,
  reviewDecision,
  ingestPolicyDocument,
  getSentinelHistory
} = require('../controllers/sentinelController');

// ─── Sentinel Policy RAG & Decision Intelligence Routes ──────────────────────

// POST /api/v1/sentinel/query — Query municipal bylaws & delay penalty guidelines
router.post('/query', queryPolicy);

// POST /api/v1/sentinel/review — Compliance audit on inter-agency project blockages
router.post('/review', reviewDecision);

// POST /api/v1/sentinel/ingest — Ingest regulatory circulars & administrative manuals
router.post('/ingest', ingestPolicyDocument);

// GET  /api/v1/sentinel/history — Query, review, and document log history
router.get('/history', getSentinelHistory);

module.exports = router;
