const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  projectId: {
    type: String,
    ref: 'Project',
    required: true
  },
  departmentId: {
    type: String,
    ref: 'Department',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'blocked'],
    default: 'pending'
  },
  plannedStartDate: {
    type: Date,
    required: true
  },
  plannedEndDate: {
    type: Date,
    required: true
  },
  actualEndDate: {
    type: Date
  },
  daysStalled: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
