'use strict';

const ACCOUNT_DATA_SHAPE = require('./ACCOUNT_DATA_SHAPE');
const isValidAccountDataSectionValue = require('./isValidAccountDataSectionValue');

module.exports = function normalizeAccountData(accountData) {
  const normalizedAccountData = {};
  for (const section in ACCOUNT_DATA_SHAPE){
    normalizedAccountData[section] = {};
    for (const key of ACCOUNT_DATA_SHAPE[section]){
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
  }
};
