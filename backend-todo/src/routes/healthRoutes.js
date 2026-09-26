const express = require('express');
const { sendSuccess } = require('../utils/apiResponse');

const router = express.Router();

/**
 * Health check endpoint.
 * GET /api/health
 */
router.get('/', (req, res) => {
  return sendSuccess(res, 'Todo API is running', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
