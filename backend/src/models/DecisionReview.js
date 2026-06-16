const mongoose = require('mongoose');

const decisionReviewSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true
  },
  decision: {
    type: String,
    required: true
  },
  recommendation: {
    type: String,
    enum: ['APPROVE', 'CONDITIONAL APPROVAL', 'DO NOT APPROVE'],
    required: true
  },
  complianceScore: {
    type: Number,
    required: true
  },
  riskScore: {
    type: Number,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  risks: {
    type: [String],
    default: []
  },
  actions: {
    type: [String],
    default: []
  },
  counterfactual: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  citations: {
    type: [String],
    default: []
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DecisionReview', decisionReviewSchema);
