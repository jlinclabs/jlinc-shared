'use strict';

const SHARED_PERSONAL_DATA_KEYS = require('./shared_personal_data_keys');

module.exports = Object.freeze(
  SHARED_PERSONAL_DATA_KEYS.reduce((DEFAULT_SHARED_PERSONAL_DATA, key) => {
    DEFAULT_SHARED_PERSONAL_DATA[key] = true;
    return DEFAULT_SHARED_PERSONAL_DATA;
  }, {})
);
