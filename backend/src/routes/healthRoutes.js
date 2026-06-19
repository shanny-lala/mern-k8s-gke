'use strict';

const { Router } = require('express');
const db = require('../config/database');

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.get('/ready', (req, res) => {
  if (!db.isConnected()) {
    return res.status(503).json({
      status: 'not_ready',
      reason: 'database_not_connected',
      timestamp: new Date().toISOString(),
    });
  }
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
