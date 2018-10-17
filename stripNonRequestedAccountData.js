'use strict';

const DEFAULT_ACCOUNT_DATA = require('./default_account_data');
const mergeAccountData = require('./mergeAccountData');

module.exports = function stripNonRequestedAccountData(accountData, requestedData) {
  if (!accountData) throw new Error('accountData is required');
  if (!requestedData) throw new Error('requestedData is required');
  const strippedAccountData = mergeAccountData(accountData, {});
  for (const section in DEFAULT_ACCOUNT_DATA){
    // if (section === 'shared_personal_data') continue;
    const requestedDataKey = section === 'shared_personal_data' ? 'personal_data' : section;
    if (!(section in accountData)) continue;
    if (!(requestedDataKey in requestedData)) {
      strippedAccountData[section] = {};
      continue;
    };
    for (const key in DEFAULT_ACCOUNT_DATA[section]){
      if (requestedData[requestedDataKey][key] !== true)
        delete strippedAccountData[section][key];
    }
  }
  return strippedAccountData;
};
