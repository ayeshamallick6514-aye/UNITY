const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  _id: {
    type: String, // e.g. 'revenue', 'pwd', 'energy', 'water_supply', 'transport'
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nodalOfficer: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  }
}, {
  _id: false, // Prevents auto-generating default ObjectId for _id
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
