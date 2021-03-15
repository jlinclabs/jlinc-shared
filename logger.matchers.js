'use strict';

const { Logger } = require('./logger');
const { definePattern } = require('./test/matchers');

definePattern('anInstanceOfLogger', target => {
  expect(target).to.be.an.instanceOf(Logger);
});


