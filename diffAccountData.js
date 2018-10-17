'use strict';

const DEFAULT_ACCOUNT_DATA = require('./default_account_data');
const isValidAccountDataSectionValue = require('./isValidAccountDataSectionValue');

module.exports = function diffAccountData(left = {}, right = {}){
  let diff = {};
  for (const section in DEFAULT_ACCOUNT_DATA){
    const leftSection = left[section];
    const rightSection = right[section];
    if (!rightSection) continue;
    diff[section] = {};
    for (const key in DEFAULT_ACCOUNT_DATA[section]){
      const rightValue = rightSection[key];
      if (!isValidAccountDataSectionValue(section, rightValue)) continue;
      if (leftSection){
        const leftValue = leftSection[key];
        if (
          isValidAccountDataSectionValue(section, leftValue) &&
          accountDataSectionValueEqual(section, leftValue, rightValue)
        ) continue;
      }
      diff[section][key] = rightValue;
    }
    if (Object.keys(diff[section]).length === 0) delete diff[section];
  }
  if (Object.keys(diff).length === 0) diff = undefined;
  return diff;
};

const accountDataSectionValueEqual = function(section, left, right){
  if (section === 'communication_channels'){
    return (!!left && left.enabled) === (!!right && right.enabled);
  }
  return left === right;
};