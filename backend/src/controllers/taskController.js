'use strict';

const taskService = require('../services/taskService');

async function getAllTasks(req, res, next) {
  try {
    const { status, priority, page, limit } = req.query;
    const result = await taskService.getAll({ status, priority, page, limit });

    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await taskService.getById(req.params.id);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await taskService.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await taskService.update(req.params.id, req.body);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    await taskService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getTaskStats(req, res, next) {
  try {
    const stats = await taskService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
