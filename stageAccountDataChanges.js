'use strict';

const normalizeAccountData = require('./normalizeAccountData');
const diffAccountData = require('./diffAccountData');
const stripNonRequestedAccountData = require('./stripNonRequestedAccountData');

module.exports = function stageAccountDataChanges({ accountData, changes, requestedData }){
  let diff = diffAccountData(
    normalizeAccountData(accountData),
    changes,
  );
  if (requestedData && diff) diff = stripNonRequestedAccountData(diff, requestedData);
  return diff;
};
