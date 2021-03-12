'use strict';

const util = require('util');
const path = require('path');
const winston = require('winston');

const logger = new winston.Logger;

logger.exitOnError = false;
logger.level = process.env.LOG_LEVEL || 'debug';

const LOGS_PATH  = path.resolve(require.main.path, `logs`);

const LOG_TO_CONSOLE = 'LOG_TO_CONSOLE' in process.env
  ? process.env.LOG_TO_CONSOLE !== '0' && process.env.LOG_TO_CONSOLE !== 'false'
  : process.env.NODE_ENV === 'development'
;

const inspect = object =>
  util.inspect(object, { showHidden: true, depth: null });

if (LOG_TO_CONSOLE){
  logger.add(winston.transports.Console, {
    level: logger.level,
    handleExceptions: false,
    json: false,
    colorize: true,
    timestamp: false,
    prettyPrint: inspect,
    stderrLevels: Object.keys(winston.levels),
  });
}

if (process.env.NODE_ENV === 'production'){
  logger.add(winston.transports.File, {
    level: logger.level,
    filename: path.resolve(LOGS_PATH, 'production.log'),
    handleExceptions: true,
    json: false,
    colorize: false,
    showLevel: true,
    timestamp: true,
    prettyPrint: inspect,
  });
}

if (process.env.NODE_ENV === 'test'){
  logger.add(winston.transports.File, {
    level: logger.level,
    filename: path.resolve(LOGS_PATH, 'test.log'),
    handleExceptions: false,
    json: false,
    colorize: false,
    maxFiles: 1,
    showLevel: true,
    timestamp: false,
    options: {flags: 'w'}, // write don't append
    prettyPrint: inspect,
  });
}

class Logger {
  constructor(superlogger, prefix){
    this._logger = superlogger;
    this._prefix = `[${prefix}]`;
  }

  prefix(prefix){
    return new Logger(this, prefix);
  }
}

'error warn info verbose debug silly'.split(' ').forEach(method => {
  Logger.prototype[method] = function(...args){
    return this._logger[method](this._prefix, ...args);
  };
});

module.exports = function(prefix){
  return new Logger(logger, prefix);
};

module.exports.Logger = Logger;
