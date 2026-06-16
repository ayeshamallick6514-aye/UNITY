const mongoose = require('mongoose');

const vectorChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  metadata: {
    title: { type: String, default: '' },
    source: { type: String, default: '' },
    department: { type: String, default: '' },
    documentType: { type: String, default: '' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VectorChunk', vectorChunkSchema);
