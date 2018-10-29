'use strict';

const ACCOUNT_DATA_SHAPE = require('./ACCOUNT_DATA_SHAPE');
const isValidAccountDataSectionValue = require('./isValidAccountDataSectionValue');

module.exports = function mergeAccountData (left, right){
  const mergedAccountData = {};
  for (const [section] of ACCOUNT_DATA_SHAPE.entries()){
    const leftSection = left && left[section];
    const rightSection = right && right[section];
    if (!rightSection && !leftSection) continue;
    mergedAccountData[section] = {};
    for (const key of ACCOUNT_DATA_SHAPE.get(section)){
      if (rightSection){
        const rightValue = rightSection[key];
        if (isValidAccountDataSectionValue(section, rightValue)){
          turnOffSharingIfPersonalDataValueIsEmptyString(section, rightValue, key, mergedAccountData);
          mergedAccountData[section][key] = rightValue;
          continue;
        }
      }
      if (leftSection){
        const leftValue = leftSection[key];
        if (isValidAccountDataSectionValue(section, leftValue)){
          turnOffSharingIfPersonalDataValueIsEmptyString(section, leftValue, key, mergedAccountData);
          mergedAccountData[section][key] = leftValue;
        }
      }
    }
    if (Object.keys(mergedAccountData[section]).length === 0)
      delete mergedAccountData[section];
  }
  return mergedAccountData;
};

function turnOffSharingIfPersonalDataValueIsEmptyString(section, value, key, mergedAccountData) {
  if (section === 'personal_data' && value === '' && mergedAccountData['shared_personal_data'] && mergedAccountData['shared_personal_data'][key]) {
    mergedAccountData['shared_personal_data'][key] = false;
  }
}
