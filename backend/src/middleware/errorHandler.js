'use strict';

const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const isMongooseValidation = err.name === 'ValidationError';
    const isMongooseCast = err.name === 'CastError';
    const isMongooseDuplicate = err.code === 11000;

    if (isMongooseValidation) {
      const messages = Object.values(err.errors).map((e) => e.message);
      error = ApiError.unprocessable(messages.join(', '));
    } else if (isMongooseCast) {
      error = ApiError.badRequest(`Invalid value for field: ${err.path}`);
    } else if (isMongooseDuplicate) {
      const field = Object.keys(err.keyValue || {})[0] || 'field';
      error = ApiError.badRequest(`Duplicate value for ${field}`);
    } else {
      error = ApiError.internal(err.message);
    }
  }

  if (!error.isOperational) {
    logger.error('Unexpected error:', { message: err.message, stack: err.stack });
  }

  res.status(error.statusCode).json({
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode,
    },
  });
}

module.exports = errorHandler;
