'use strict';

process.env.NODE_ENV = 'test';

const { chai, _, expect } = require('./matchers');
require('sinon');
chai.use(require('sinon-chai'));
global._ = _;
global.expect = expect;
