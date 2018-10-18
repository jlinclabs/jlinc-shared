'use strict';

const DEFAULT_ACCOUNT_DATA = require('./default_account_data');
const isValidAccountDataSectionValue = require('./isValidAccountDataSectionValue');

module.exports = function normalizeAccountData(accountData) {
  const normalizedAccountData = {};
  for (const section in DEFAULT_ACCOUNT_DATA){
    normalizedAccountData[section] = {};
    for (const key in DEFAULT_ACCOUNT_DATA[section]){
      let newValue = accountData && accountData[section] && accountData[section][key];
      normalizedAccountData[section][key] = isValidAccountDataSectionValue(section, newValue)
        ? newValue
        : defaultAccountDataSectionValue(section);
    }
  }
  return normalizedAccountData;
};

const defaultAccountDataSectionValue = function(section){
  switch(section) {
  case 'shared_personal_data':
  case 'consents':
    return false;
  case 'communication_channels':
    return { enabled: false };
  case 'personal_data':
    return '';
  default:
    throw new Error(`invalid section ${section}`);
  }
};
