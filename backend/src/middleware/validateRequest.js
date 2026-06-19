'use strict';

const ApiError = require('../utils/ApiError');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateCreateTask(req, res, next) {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return next(ApiError.badRequest('Title is required and must be a non-empty string'));
  }

  if (title.trim().length > 200) {
    return next(ApiError.badRequest('Title must not exceed 200 characters'));
  }

  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    return next(ApiError.badRequest(`Status must be one of: ${VALID_STATUSES.join(', ')}`));
  }

  if (req.body.priority && !VALID_PRIORITIES.includes(req.body.priority)) {
    return next(ApiError.badRequest(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`));
  }

  next();
}

function validateUpdateTask(req, res, next) {
  const { title, status, priority } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return next(ApiError.badRequest('Title must be a non-empty string'));
    }
    if (title.trim().length > 200) {
      return next(ApiError.badRequest('Title must not exceed 200 characters'));
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return next(ApiError.badRequest(`Status must be one of: ${VALID_STATUSES.join(', ')}`));
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return next(ApiError.badRequest(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`));
  }

  if (Object.keys(req.body).length === 0) {
    return next(ApiError.badRequest('Request body must not be empty'));
  }

  next();
}

module.exports = { validateCreateTask, validateUpdateTask };
