'use strict';

const COMMUNICATION_CHANNELS = require('./communication_channels');

module.exports = Object.freeze(
  COMMUNICATION_CHANNELS.reduce((DEFAULT_COMMUNICATION_CHANNELS, communicationChannel) => {
    DEFAULT_COMMUNICATION_CHANNELS[communicationChannel] = Object.freeze({ enabled: false });
    return DEFAULT_COMMUNICATION_CHANNELS;
  }, {})
);
