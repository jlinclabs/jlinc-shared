'use strict';

const PLEDGE_YEARS = Object.freeze([
  2020, 2025, 2030, 2035, 2040, 2045, 2050,
]);

const PLEDGE_TYPES = Object.freeze([
  'Carbon Neutral',
  '100% Clean Energy',
  'Carbon Removal',
]);

function isValidPledgeYear(pledgeYear) {
  return PLEDGE_YEARS.includes(pledgeYear);
}

function isValidPledgeType(pledgeType) {
  return PLEDGE_TYPES.includes(pledgeType);
}

module.exports = {
  PLEDGE_TYPES,
  PLEDGE_YEARS,
  isValidPledgeYear,
  isValidPledgeType,
};
