'use strict';

module.exports = function getRequestedDataForOrganization(organization){
  const requestedData = {};
  requestedData.personal_data = organization.requested_data || {};
  requestedData.consents = Object.entries(organization.consents || {}).reduce(reduceConsent, {});
  requestedData.communication_channels = organization.communication_channels || {};
  return requestedData;
};

const reduceConsent = function(consents, [key, value]){
  consents[key] = !!(value && value.enabled);
  return consents;
};
