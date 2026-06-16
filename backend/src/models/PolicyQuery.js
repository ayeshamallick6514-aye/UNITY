const mongoose = require('mongoose');

const policyQuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
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

module.exports = mongoose.model('PolicyQuery', policyQuerySchema);
