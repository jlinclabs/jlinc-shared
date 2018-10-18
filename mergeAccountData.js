'use strict';

const ACCOUNT_DATA_SHAPE = require('./ACCOUNT_DATA_SHAPE');
const isValidAccountDataSectionValue = require('./isValidAccountDataSectionValue');

module.exports = function mergeAccountData (left, right){
  const mergedAccountData = {};
  for (const section in ACCOUNT_DATA_SHAPE){
    const leftSection = left && left[section];
    const rightSection = right && right[section];
    if (!rightSection && !leftSection) continue;
    mergedAccountData[section] = {};
    for (const key of ACCOUNT_DATA_SHAPE[section]){
      if (rightSection){
        const rightValue = rightSection[key];
        if (isValidAccountDataSectionValue(section, rightValue)){
          mergedAccountData[section][key] = rightValue;
          continue;
        }
      }
      if (leftSection){
        const leftValue = leftSection[key];
        if (isValidAccountDataSectionValue(section, leftValue)){
          mergedAccountData[section][key] = leftValue;
        }
      }
    }
    if (Object.keys(mergedAccountData[section]).length === 0)
      delete mergedAccountData[section];
  }
  return mergedAccountData;
};