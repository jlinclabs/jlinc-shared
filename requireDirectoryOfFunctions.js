'use strict';

const { Logger } = require('./logger');
const requireAll = require('require-all');

module.exports = function requireDirectoryOfFunction(module){
  const className = pathToClassName(module.path);

  const functions = requireAll({
    dirname: module.path,
    filter: new RegExp(`(.+${className})\.js$`),
  });

  const trailingClassName = new RegExp(`${className}$`);
  Object.entries(functions).forEach(([key, action]) => {
    const name = key.replace(trailingClassName,'');
    const loggerPrefix = `${className}:${name}`;
    module.exports[name] = function(options = {}){
      if (!(options.logger instanceof Logger))
        throw new Error(`${loggerPrefix} requires logger`);
      const logger = options.logger.prefix(loggerPrefix);
      let thenable;
      try{
        thenable = action({ ...options, logger });
      }catch(error){
        logger.error(error);
        return Promise.reject(error);
      }
      return Promise.resolve(thenable).catch(error => {
        logger.error(error);
        throw error;
      });
    };
  });
};


const pathToClassName = path =>
  path.split('/').reverse()[0]
    .replace(/ies$/,'y')
    .replace(/s$/,'')
    .replace(/^(.)/, x => x.toUpperCase());

module.exports.pathToClassName = pathToClassName;
