'use strict';

const SHARED_PERSONAL_DATA_KEYS = require('./shared_personal_data_keys');
const PERSONAL_DATA_KEYS = require('./personal_data_keys');
const CONSENT_KEYS = require('./consents');
const COMMUNICATION_CHANNELS_KEYS = require('./communication_channels');

module.exports = function({ currentAccountData = {}, stagedChanges = {}, newChanges = {} }){
  const newStagedChanges = {};
  SECTION_KEYS.forEach(function([section, keys]){
    const newStagedSection = {};
    if (!stagedChanges[section] && !newChanges[section]) return;
    keys.forEach(function(key) {
      let current = currentAccountData[section] &&  currentAccountData[section][key];
      let staged  =      stagedChanges[section] &&       stagedChanges[section][key];
      let change  =         newChanges[section] &&          newChanges[section][key];
      if (current === null) current = undefined;
      if (staged === null) staged = undefined;
      if (change === null) change = undefined;
      if (staged === undefined && change === undefined) return;
      const newValue = calculateNewStagedValue(section, current, staged, change);
      if (newValue !== undefined) newStagedSection[key] = newValue;
    });
    if (!isEmpty(newStagedSection)) newStagedChanges[section] = newStagedSection;
  });

  return isEmpty(newStagedChanges) ? undefined : newStagedChanges;
};

const SECTION_KEYS = Object.freeze([
  ['shared_personal_data', SHARED_PERSONAL_DATA_KEYS],
  ['personal_data', PERSONAL_DATA_KEYS],
  ['consents', CONSENT_KEYS],
  ['communication_channels', COMMUNICATION_CHANNELS_KEYS],
]);

const isEmpty = object =>
  !object || Object.keys(object).length === 0;

const calculateNewStagedValue = function(section, current, staged, change) {
  let potentialChange;
  switch(section){
  case 'shared_personal_data':
  case 'consents':
    current = !!current;
    potentialChange = change === undefined ? staged : change;
    if (potentialChange === current) return undefined;
    return potentialChange;
  case 'personal_data':
    if (current === undefined) current = '';
    if (change !== undefined && change === current) return undefined;
    if (change === undefined) return staged;
    return change;
  case 'communication_channels':
    current = current === undefined ? false : !!current.enabled;
    staged = staged === undefined ? undefined : !!staged.enabled;
    change = change === undefined ? undefined : !!change.enabled;
    potentialChange = change === undefined ? staged : change;
    if (potentialChange === current) return undefined;
    return { enabled: potentialChange };
  }
};
