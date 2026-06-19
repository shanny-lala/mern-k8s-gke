'use strict';

const { Router } = require('express');
const taskRoutes = require('./taskRoutes');
const healthRoutes = require('./healthRoutes');

const router = Router();

router.use('/', healthRoutes);
router.use('/api/tasks', taskRoutes);

module.exports = router;
