'use strict';

const deepcopy = require('deepcopy');

const SHARED_PERSONAL_DATA_KEYS = require('./shared_personal_data_keys');
const PERSONAL_DATA_KEYS = require('./personal_data_keys');
const CONSENT_KEYS = require('./consents');
const COMMUNICATION_CHANNELS_KEYS = require('./communication_channels');

module.exports = function({ currentAccountData, stagedChanges, newChanges }){
  const newStagedChanges = {};
  if (isEmpty(newChanges)) return isEmpty(stagedChanges) ? undefined : deepcopy(stagedChanges);
  SECTION_KEYS.forEach(function([section, keys]){
    const newStagedSection = {};
    if (!(stagedChanges || {})[section] && !newChanges[section]) return;
    keys.forEach(function(key) {
      const current = currentAccountData && currentAccountData[section] &&  currentAccountData[section][key];
      const staged  =      stagedChanges &&      stagedChanges[section] &&       stagedChanges[section][key];
      const change  =         newChanges &&         newChanges[section] &&          newChanges[section][key];
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
    break;
  case 'personal_data':
    if (change !== undefined && change === current) return undefined;
    if (change === undefined) return staged;
    return change;
    break;
  case 'communication_channels':
    current = current === undefined ? false : !!current.enabled;
    staged = staged === undefined ? undefined : !!staged.enabled;
    change = change === undefined ? undefined : !!change.enabled;
    potentialChange = change === undefined ? staged : change;
    if (potentialChange === current) return undefined;
    return { enabled: potentialChange };
    break;
  }
};
