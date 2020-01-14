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

function isMoreAggressivePledge(existingPledge, newPledge){
  if (!existingPledge) return true;
  const newTypeIndex = PLEDGE_TYPES.indexOf(newPledge.pledgeType);
  const existingTypeIndex = PLEDGE_TYPES.indexOf(existingPledge.pledgeType);
  const newYearIndex = PLEDGE_YEARS.indexOf(newPledge.pledgeYear);
  const existingYearIndex = PLEDGE_YEARS.indexOf(existingPledge.pledgeYear);
  return (
    newTypeIndex > existingTypeIndex ||
    (
      existingTypeIndex === newTypeIndex &&
      newYearIndex < existingYearIndex
    )
  );
}

module.exports = {
  PLEDGE_TYPES,
  PLEDGE_YEARS,
  isValidPledgeYear,
  isValidPledgeType,
  isMoreAggressivePledge,
};
