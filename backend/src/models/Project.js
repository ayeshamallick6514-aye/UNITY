const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  _id: {
    type: String, // e.g. 'proj_mp_nagar', 'proj_aiims', 'proj_kolar'
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  dailyIdleBurn: {
    type: Number,
    required: true,
    default: 0
  },
  penaltyActivationDate: {
    type: Date,
    required: true
  },
  penaltyValue: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  _id: false,
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
