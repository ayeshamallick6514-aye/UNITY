const mongoose = require('mongoose');

const dependencySchema = new mongoose.Schema({
  blockedTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  blockingTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  dependencyType: {
    type: String,
    default: 'finish_to_start'
  },
  escalationStatus: {
    type: String,
    enum: ['idle', 'escalated', 'deferred', 'authorized'],
    default: 'idle'
  }
}, {
  timestamps: true
});

// Avoid duplicate dependency records
dependencySchema.index({ blockedTaskId: 1, blockingTaskId: 1 }, { unique: true });

module.exports = mongoose.model('Dependency', dependencySchema);
