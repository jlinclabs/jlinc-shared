'use strict';

const CONSENTS = require('./consents');

module.exports = Object.freeze(
  CONSENTS.reduce((DEFAULT_CONSENTS, consent) => {
    DEFAULT_CONSENTS[consent] = false;
    return DEFAULT_CONSENTS;
  }, {})
);
