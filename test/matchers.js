'use strict';

const chai = require('chai');
const chaiMatchPattern = require('chai-match-pattern');
const matchPattern = require('lodash-match-pattern');
chai.use(chaiMatchPattern);
const expect = chai.expect;
const _ = chaiMatchPattern.getLodashModule();
const definePattern = require('./definePattern');

module.exports = {
  _,
  chai,
  expect,
  definePattern,
  matchPattern,
};

