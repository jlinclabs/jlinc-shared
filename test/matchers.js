'use strict';

const chai = require('chai');
const { _, matchPattern, definePattern } = require('./patternMatchers');
const expect = chai.expect;

module.exports = {
  _,
  chai,
  expect,
  definePattern,
  matchPattern,
};

