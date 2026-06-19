'use strict';

const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

const RETRY_INTERVAL_MS = 5000;
const MAX_RETRIES = 5;

async function connect(retries = MAX_RETRIES) {
  try {
    await mongoose.connect(config.database.uri, config.database.options);
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    if (retries > 0) {
      logger.warn(
        `MongoDB connection failed. Retrying in ${RETRY_INTERVAL_MS / 1000}s... (${retries} attempts left)`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      return connect(retries - 1);
    }
    logger.error('MongoDB connection failed after maximum retries:', err.message);
    process.exit(1);
  }
}

function disconnect() {
  return mongoose.connection.close();
}

function isConnected() {
  return mongoose.connection.readyState === 1;
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

module.exports = { connect, disconnect, isConnected };
