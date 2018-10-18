'use strict';

const PERSONAL_DATA_KEYS = require('./personal_data_keys');
const CONSENTS = require('./consents');
const COMMUNICATION_CHANNELS = require('./communication_channels');

module.exports = Object.freeze({
  shared_personal_data: PERSONAL_DATA_KEYS,
  personal_data: PERSONAL_DATA_KEYS,
  consents: CONSENTS,
  communication_channels: COMMUNICATION_CHANNELS,
});
