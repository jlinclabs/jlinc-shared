'use strict';

module.exports = function isValidAccountDataSectionValue(section, value){
  switch(section) {
  case 'personal_data':
    return typeof value === 'string';
  case 'shared_personal_data':
  case 'consents':
    return typeof value === 'boolean';
  case 'communication_channels':
    return !!value && typeof value.enabled === 'boolean';
  default:
    throw new Error(`invalid account data section: "${section}"`);
  }
};
