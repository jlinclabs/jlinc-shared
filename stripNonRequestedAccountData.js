'use strict';

const ACCOUNT_DATA_KEYS = require('./account_data_keys');
const mergeAccountData = require('./mergeAccountData');

module.exports = function stripNonRequestedAccountData(accountData, requestedData) {
  if (!accountData) throw new Error('accountData is required');
  if (!requestedData) throw new Error('requestedData is required');
  const strippedAccountData = mergeAccountData(accountData, {});
  for (const section of ACCOUNT_DATA_KEYS){
    if (!(section in accountData)) continue;

    const requestedDataKey = section === 'shared_personal_data' ? 'personal_data' : section;
    if (!(requestedDataKey in requestedData)){
      delete strippedAccountData[section];
      continue;
    }

    if (strippedAccountData[section]){
      for (const key in strippedAccountData[section]){
        if (requestedData[requestedDataKey][key] !== true)
          delete strippedAccountData[section][key];
      }
    }
  }
  return Object.keys(strippedAccountData).length === 0 ? undefined : strippedAccountData;
};
