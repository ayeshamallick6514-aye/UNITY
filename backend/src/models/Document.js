const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  documentType: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
