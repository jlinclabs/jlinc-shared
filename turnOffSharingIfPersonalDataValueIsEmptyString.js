'use strict';

module.exports = function turnOffSharingIfPersonalDataValueIsEmptyString(section, key, value, accountData) {
  if (section === 'personal_data' && value === '') {
    if (!accountData['shared_personal_data']) accountData['shared_personal_data'] = {};
    accountData['shared_personal_data'][key] = false;
  }
};
