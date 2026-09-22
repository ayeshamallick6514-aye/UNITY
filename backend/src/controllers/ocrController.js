'use strict';

/**
 * ocrController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * POST /api/v1/ocr/analyze
 * Accepts multipart/form-data image upload, runs local Tesseract OCR,
 * returns structured civic validation payload.
 *
 * Multer is configured for memory storage — no files written to disk.
 */

const multer        = require('multer');
const { analyzeImage } = require('../services/ocrService');

// ─── Multer — memory storage, images only, 15MB cap ──────────────────────────
const _upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 15 * 1024 * 1024 },   // 15 MB
  fileFilter(_req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Accepted: JPEG, PNG, WEBP.`));
    }
  },
}).single('image');   // field name expected from frontend FormData

// ─── POST /api/v1/ocr/analyze ─────────────────────────────────────────────────
exports.analyzeGrievanceImage = function analyzeGrievanceImage(req, res) {
  _upload(req, res, async (uploadErr) => {
    // 1. Handle multer errors (file type, size)
    if (uploadErr) {
      return res.status(400).json({
        success: false,
        error:   'UPLOAD_ERROR',
        message: uploadErr.message,
      });
    }

    // 2. Ensure a file was actually attached
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        error:   'NO_FILE',
        message: 'No image attached. Send multipart/form-data with field "image".',
      });
    }

    try {
      // 3. Run OCR pipeline
      const analysis = await analyzeImage(req.file.buffer, req.file.originalname);

      // 4. Attach request metadata
      const payload = {
        success:          true,
        requestId:        `OCR-${Date.now()}`,
        zone:             'BHOPAL_METRO_ZONE_01',
        submittedBy:      '[ROLE: CITIZEN_PORTAL]',
        fileName:         req.file.originalname,
        fileSizeKb:       Math.round(req.file.size / 1024),
        mimeType:         req.file.mimetype,
        analysis,
        // Human-readable verdict for the UI status card
        verdict: analysis.valid
          ? { code: 'ACCEPTED', label: 'Image Validated', color: 'green' }
          : analysis.status === 'DUPLICATE'
            ? { code: 'DUPLICATE', label: 'Duplicate Report Detected', color: 'amber' }
            : { code: 'REJECTED', label: 'Image Failed Validation', color: 'red' },
      };

      const httpStatus = analysis.valid ? 200 : (analysis.status === 'DUPLICATE' ? 409 : 422);
      return res.status(httpStatus).json(payload);

    } catch (err) {
      console.error('[OCR Controller] Unhandled error:', err);
      return res.status(500).json({
        success: false,
        error:   'OCR_ENGINE_ERROR',
        message: err.message ?? 'OCR processing failed. Please retry.',
      });
    }
  });
};

// ─── GET /api/v1/ocr/status ───────────────────────────────────────────────────
// Health probe — confirms OCR engine is importable before first real request
exports.getOcrStatus = async function getOcrStatus(_req, res) {
  try {
    const { createWorker } = require('tesseract.js');
    return res.json({
      success:   true,
      engine:    'Tesseract.js',
      version:   require('tesseract.js/package.json').version,
      status:    'AVAILABLE',
      zone:      'BHOPAL_METRO_ZONE_01',
      endpoints: {
        analyze: 'POST /api/v1/ocr/analyze  (multipart/form-data, field: "image")',
        status:  'GET  /api/v1/ocr/status',
      },
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      engine:  'Tesseract.js',
      status:  'UNAVAILABLE',
      error:   err.message,
    });
  }
};
