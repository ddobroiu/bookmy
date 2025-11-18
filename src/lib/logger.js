// src/lib/logger.js

const LOG_LEVELS = {
  INFO: 0,
  WARN: 1,
  ERROR: 2,
};

const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;

const logger = {
  info: (...args) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      console.error('[ERROR]', ...args);
    }
  },
};

export default logger;
