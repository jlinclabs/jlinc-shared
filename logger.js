'use strict';
/* eslint no-console: 0 */

const util = require('util');
const Path = require('path');
const winston = require('winston');
const colors = require('colors/safe');
const { MESSAGE } = require('triple-beam');

const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_LOG_NAME = process.env.APP_LOG_NAME;
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

/* istanbul ignore next */
const LOG_TO_CONSOLE = !!(
  'LOG_TO_CONSOLE' in process.env &&
  !['0', 'false'].includes(process.env.LOG_TO_CONSOLE)
);

const MAX_LINES = 10 * 1000;
const LEVELS = 'error warn info http verbose debug silly'.split(' ');

const { transports, format } = winston;

const inspect = (object, opts = {}) =>
  util.inspect(object, { colors: true, depth: Infinity, ...opts });

const errorToObject = error => (
  error instanceof Error
  ? {
    name: error.name,
    message: error.message,
    stack: error.stack,
  }
  : error
);

const cleanMessage = message => {
  if (!Array.isArray(message)) message = [message];
  return message.map(errorToObject);
};

const jsonFormat = format.combine(
  format.timestamp(),
  format(({ message, ...info }) => {
    return { ...info, message: cleanMessage(message) };
  })(),
  format.json(),
  format(info => {
    if (info[MESSAGE].length > MAX_LINES) console.trace('LOG TOO BIG!', info);
    return info;
  })(),
);

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(({ trace, level, context, message }) => {
    message = cleanMessage(message);
    if (message.length === 1) message = message[0];
    if (typeof message !== 'string') message = inspect(message);
    message = message.replace(/[\s\n]+$/, '');
    message = message.includes('\n')
      ? ('\n' + message
        .split('\n')
        .slice(0, MAX_LINES) // max lines
        .map(l => `  ${l}`) // indent
        .join('\n')
      )
      : ' ' + message
    ;
    return (
      `${level} ` +
      `${colors.bold(colors.blue(trace))} ` +
      `${colors.grey(inspect(context, { compact: true, colors: false }))}` +
      `${colors.white(message)}`
    );
  }),
);

function createLogger(name){
  const LOGS_PATH = Path.resolve(require('./projectRootPath'), `logs`);

  const logger = winston.createLogger({
    level: LOG_LEVEL,
    defaultMeta: { app: APP_LOG_NAME },
    handleExceptions: true,
    exitOnError: false,
    prettyPrint: inspect,
    showLevel: true,
    timestamp: true,
    transports: [
      new transports.File({
        level: LOG_LEVEL,
        dirname: LOGS_PATH,
        filename: name ? `${NODE_ENV}.${name}.log` : `${NODE_ENV}.log`,
        format: jsonFormat,
        options: process.env.NODE_ENV === 'test'
          ? { flags: 'w' } // write don't append
          : undefined,
      })
    ],
  });

  /* istanbul ignore if */
  if (LOG_TO_CONSOLE) logger.add(new transports.Console({
    level: (
      LEVELS.includes(process.env.LOG_TO_CONSOLE)
        ? process.env.LOG_TO_CONSOLE
        : LOG_LEVEL
    ),
    format: consoleFormat,
    colorize: true,
    stderrLevels: LEVELS,
  }));

  return new Logger(logger, name ? [name] : [], {});
}

class Logger {
  constructor(winstonLogger, trace, context = {}){
    Object.assign(this, { winstonLogger, trace, context });
  }

  ctx(name, context){
    if (typeof name === undefined) throw new InputError(`"undefined" is invalid`);
    if (typeof name === 'object') { context = name; name = undefined; }
    const trace = [...this.trace];
    if (name) trace.push(name);
    return new Logger(this.winstonLogger, trace, {...this.context, ...context});
  }

  traceString(){
    return this.trace.filter(x => x).join('→');
  }

  toString(){
    return `${this.constructor.name}(${this.traceString()})`;
  }

  [util.inspect.custom](){
    return this.toString();
  }
}

LEVELS.forEach(method => {
  Logger.prototype[method] = function(...args){
    this.winstonLogger[method]({
      context: this.context,
      trace: this.traceString(),
      message: args,
    });
  };
});

module.exports = (name, metadata) => module.exports.logger.ctx(name, metadata);
Object.defineProperty(module.exports, 'logger', {
  get(){
    if (!module.exports._logger)
      module.exports._logger = createLogger();
    return module.exports._logger;
  }
});

Object.assign(module.exports, {
  jsonFormat,
  consoleFormat,
  createLogger,
  Logger,
});
