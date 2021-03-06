'use strict';

const ACCOUNT_DATA_SHAPE = require('./ACCOUNT_DATA_SHAPE');
const isValidAccountDataSectionValue = require('./isValidAccountDataSectionValue');
const turnOffSharingIfPersonalDataValueIsEmptyString  = require('./turnOffSharingIfPersonalDataValueIsEmptyString');
const extractCustomPersonalDataKeys = require('./extractCustomPersonalDataKeys');

module.exports = function normalizeAccountData(accountData) {
  const normalizedAccountData = {};
  for (const [section] of ACCOUNT_DATA_SHAPE.entries()){
    normalizedAccountData[section] = {};
    const keys = [...ACCOUNT_DATA_SHAPE.get(section)];
    if (accountData && (section === 'personal_data' || section === 'shared_personal_data')){
      keys.push(...extractCustomPersonalDataKeys(accountData[section]));
    }
    for (const key of keys){
      let newValue = accountData && accountData[section] && accountData[section][key];
      if (isValidAccountDataSectionValue(section, newValue)) {
        turnOffSharingIfPersonalDataValueIsEmptyString(section, key, newValue, normalizedAccountData);
        normalizedAccountData[section][key] = newValue;
      } else {
        normalizedAccountData[section][key] = defaultAccountDataSectionValue(section);
      }
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
