'use strict';

process.env.NODE_ENV = 'test';
process.env.APP_LOG_NAME = 'test-app';
process.env.APP_ROOT_PATH = __dirname;

const { chai, _, expect } = require('./matchers');
require('sinon');
chai.use(require('sinon-chai'));
global._ = _;
global.expect = expect;
