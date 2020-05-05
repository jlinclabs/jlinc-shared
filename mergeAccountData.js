'use strict';

const ACCOUNT_DATA_SHAPE = require('./ACCOUNT_DATA_SHAPE');
const isValidAccountDataSectionValue = require('./isValidAccountDataSectionValue');
const turnOffSharingIfPersonalDataValueIsEmptyString  = require('./turnOffSharingIfPersonalDataValueIsEmptyString');
const extractCustomPersonalDataKeys = require('./extractCustomPersonalDataKeys');

module.exports = function mergeAccountData(left, right){
  const mergedAccountData = {};
  for (const [section] of ACCOUNT_DATA_SHAPE.entries()){
    const leftSection = left && left[section];
    const rightSection = right && right[section];
    if (!rightSection && !leftSection) continue;
    mergedAccountData[section] = {};

    const keys = [...ACCOUNT_DATA_SHAPE.get(section)];
    if (section === 'personal_data' || section === 'shared_personal_data'){
      keys.push(...extractCustomPersonalDataKeys(leftSection, rightSection));
    }
    for (const key of keys){
      if (rightSection){
        const rightValue = rightSection[key];
        if (isValidAccountDataSectionValue(section, rightValue)){
          turnOffSharingIfPersonalDataValueIsEmptyString(section, key, rightValue, mergedAccountData);
          mergedAccountData[section][key] = rightValue;
          continue;
        }
      }
      if (leftSection){
        const leftValue = leftSection[key];
        if (isValidAccountDataSectionValue(section, leftValue)){
          turnOffSharingIfPersonalDataValueIsEmptyString(section, key, leftValue, mergedAccountData);
          mergedAccountData[section][key] = leftValue;
        }
      }
    }
    if (Object.keys(mergedAccountData[section]).length === 0)
      delete mergedAccountData[section];
  }
  return mergedAccountData;
};
