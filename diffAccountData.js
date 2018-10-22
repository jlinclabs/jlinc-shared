'use strict';

const ACCOUNT_DATA_SHAPE = require('./ACCOUNT_DATA_SHAPE');
const isValidAccountDataSectionValue = require('./isValidAccountDataSectionValue');

module.exports = function diffAccountData(left = {}, right = {}){
  let diff = {};
  for (const section in ACCOUNT_DATA_SHAPE){
    const leftSection = left[section];
    const rightSection = right[section];
    if (!rightSection) continue;
    diff[section] = {};
    for (const key of ACCOUNT_DATA_SHAPE[section]){
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