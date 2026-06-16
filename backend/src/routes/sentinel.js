const express = require('express');
const router = express.Router();
const Dependency = require('../models/Dependency');
const PolicyQuery = require('../models/PolicyQuery');
const DecisionReview = require('../models/DecisionReview');
const Document = require('../models/Document');
const {
  ingestDocument,
  runDecisionReview,
  runPolicyQuery
} = require('../services/sentinelService');

// Ingest circulars/orders
router.post('/ingest', async (req, res) => {
  try {
    const { title, source, department, documentType, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and Content are required.' });
    }
    const result = await ingestDocument({
      title,
      source: source || 'Internal Circular',
      department: department || 'General',
      documentType: documentType || 'SOP',
      content
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run a policy search/RAG query
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query text is required.' });
    }
    const result = await runPolicyQuery(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run compliance audit review on a decision/blockage
router.post('/review', async (req, res) => {
  try {
    const { dependencyId, decisionKey } = req.body;
    if (!dependencyId) {
      return res.status(400).json({ error: 'dependencyId is required.' });
    }

    // Fetch the live dependency details from DB
    const dependency = await Dependency.findById(dependencyId)
      .populate({
        path: 'blockedTaskId',
        populate: [{ path: 'projectId' }, { path: 'departmentId' }]
      })
      .populate({
        path: 'blockingTaskId',
        populate: { path: 'departmentId' }
      });

    if (!dependency) {
      return res.status(404).json({ error: 'Dependency blockage not found.' });
    }

    // Map project data context
    const projectId = dependency.blockedTaskId?.projectId?._id || 'proj_unknown';
    const projectData = {
      name: dependency.blockedTaskId?.projectId?.name || 'Unknown Project',
      daysPending: dependency.blockedTaskId?.daysStalled || 0,
      dailyIdleBurn: dependency.blockedTaskId?.projectId?.dailyIdleBurn || 0,
      blockingDept: dependency.blockingTaskId?.departmentId?.name || 'N/A',
      waitingDept: dependency.blockedTaskId?.departmentId?.name || 'N/A',
      situation: `${dependency.blockedTaskId?.title} is blocked by ${dependency.blockingTaskId?.departmentId?.name}'s ${dependency.blockingTaskId?.title}.`
    };

    const review = await runDecisionReview(projectId, decisionKey || 'dc1', projectData);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve query/review logs history
router.get('/history', async (req, res) => {
  try {
    const queries = await PolicyQuery.find().sort({ timestamp: -1 }).limit(10);
    const reviews = await DecisionReview.find().sort({ timestamp: -1 }).limit(10);
    const documents = await Document.find().sort({ uploadedAt: -1 }).select('title source department documentType uploadedAt');
    
    res.json({
      queries,
      reviews,
      documents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
