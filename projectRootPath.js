'use strict';

/* istanbul ignore next */
if (!process.env.APP_ROOT_PATH)
  throw new Error(`jlinc-shared expected process.env.APP_ROOT_PATH to be set`);

module.exports = process.env.APP_ROOT_PATH;
