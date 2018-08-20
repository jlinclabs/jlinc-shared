'use strict';

const DEFAULT_SHARED_PERSONAL_DATA = require('./default_shared_personal_data');
const COMMUNICATION_CHANNEL_KEYS = require('./communication_channels');

module.exports = function mergeAccountData ({changes, accountData}) {
  if (!changes) throw new Error('changes required');
  if (!accountData) throw new Error('accountData required');

  const mergedAccountData = {
    personal_data: {},
    communication_channels: {},
    shared_personal_data: {...DEFAULT_SHARED_PERSONAL_DATA},
    consents: {}
  };

  Object.keys(mergedAccountData).forEach(key => {
    if (key === 'communication_channels') {
      COMMUNICATION_CHANNEL_KEYS.forEach(communicationChannelKey => {
        if (
          (changes[key] && changes[key][communicationChannelKey]) ||
          (accountData[key] && accountData[key][communicationChannelKey])
        ) {
          mergedAccountData[key][communicationChannelKey] = {};
          Object.assign(
            mergedAccountData[key][communicationChannelKey],
            accountData[key][communicationChannelKey] || {},
            changes[key][communicationChannelKey] || {},
          );
        }
      });
    } else {
      Object.assign(
        mergedAccountData[key],
        accountData[key] || {},
        changes[key] || {},
      );
    }
  });

  return mergedAccountData;
};
