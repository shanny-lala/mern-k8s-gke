'use strict';

const { Router } = require('express');
const taskController = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validateRequest');

const router = Router();

router.get('/stats', taskController.getTaskStats);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateCreateTask, taskController.createTask);
router.put('/:id', validateUpdateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
