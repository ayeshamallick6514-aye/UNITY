'use strict';
const express = require('express');
const router  = express.Router();
const { trackComplaint, fileComplaint } = require('../controllers/complaintTrackController');

router.get('/track/:refId', trackComplaint);
router.post('/file',        fileComplaint);

module.exports = router;
