'use strict';

const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const config = require('../config');

async function getAll({ status, priority, page = 1, limit } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(
    config.pagination.maxLimit,
    Math.max(1, parseInt(limit, 10) || config.pagination.defaultLimit)
  );
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

async function getById(id) {
  const task = await Task.findById(id);
  if (!task) {
    throw ApiError.notFound(`Task with id ${id} not found`);
  }
  return task;
}

async function create(data) {
  const task = await Task.create({
    title: data.title.trim(),
    description: data.description ? data.description.trim() : '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
  });
  return task;
}

async function update(id, data) {
  const updates = {};
  if (data.title !== undefined) updates.title = data.title.trim();
  if (data.description !== undefined) updates.description = data.description.trim();
  if (data.status !== undefined) updates.status = data.status;
  if (data.priority !== undefined) updates.priority = data.priority;

  const task = await Task.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw ApiError.notFound(`Task with id ${id} not found`);
  }
  return task;
}

async function remove(id) {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    throw ApiError.notFound(`Task with id ${id} not found`);
  }
  return task;
}

async function getStats() {
  const [statusCounts, priorityCounts, total] = await Promise.all([
    Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Task.countDocuments(),
  ]);

  const byStatus = { pending: 0, 'in-progress': 0, completed: 0 };
  statusCounts.forEach(({ _id, count }) => {
    byStatus[_id] = count;
  });

  const byPriority = { low: 0, medium: 0, high: 0 };
  priorityCounts.forEach(({ _id, count }) => {
    byPriority[_id] = count;
  });

  return { total, byStatus, byPriority };
}

module.exports = { getAll, getById, create, update, remove, getStats };
