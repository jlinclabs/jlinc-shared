'use strict';

const PERSONAL_DATA_KEYS = require('./personal_data_keys');

module.exports = Object.freeze(
  PERSONAL_DATA_KEYS.reduce((DEFAULT_PERSONAL_DATA, key) => {
    DEFAULT_PERSONAL_DATA[key] = null;
    return DEFAULT_PERSONAL_DATA;
  }, {})
);
