const mongoose = require('mongoose');

const auditEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['completed', 'flagged', 'critical', 'info'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  departmentId: {
    type: String,
    ref: 'Department',
    required: true
  },
  time: {
    type: String, // format 'HH:MM' matching frontend log presentation
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditEvent', auditEventSchema);
