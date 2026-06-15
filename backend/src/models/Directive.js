const mongoose = require('mongoose');

const directiveSchema = new mongoose.Schema({
  dependencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dependency',
    required: true
  },
  authorizedBy: {
    type: String,
    required: true
  },
  actionTaken: {
    type: String,
    required: true
  },
  complianceDeadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'complied', 'breached'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Directive', directiveSchema);
