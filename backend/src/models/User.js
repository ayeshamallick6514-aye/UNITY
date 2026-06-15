const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['Collector', 'Commissioner', 'Department Head', 'Project Officer'],
    required: true
  },
  departmentId: {
    type: String, // References Department._id
    ref: 'Department',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
