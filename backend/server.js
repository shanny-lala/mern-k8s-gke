'use strict';

require('dotenv').config();

const app = require('./src/app');
const config = require('./src/config');
const db = require('./src/config/database');
const logger = require('./src/utils/logger');

async function start() {
  await db.connect();

  const server = app.listen(config.server.port, config.server.host, () => {
    logger.info(
      `Server running in ${config.env} mode on ${config.server.host}:${config.server.port}`
    );
  });

  function shutdown(signal) {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      await db.disconnect();
      logger.info('Server and database connection closed');
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();