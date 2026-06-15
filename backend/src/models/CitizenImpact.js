const mongoose = require('mongoose');

const citizenImpactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  impactType: {
    type: String,
    enum: ['healthcare', 'education', 'emergency_route', 'commercial'],
    required: true
  },
  citizensAffected: {
    type: Number,
    required: true,
    default: 0
  },
  projectId: {
    type: String,
    ref: 'Project',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CitizenImpact', citizenImpactSchema);
