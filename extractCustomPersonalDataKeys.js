'use strict';

module.exports = function extractCustomPersonalDataKeys(leftSection, rightSection){
  const customKeys = {};
  [
    ...Object.keys(leftSection || {}),
    ...Object.keys(rightSection || {})
  ]
    .filter(key => key.match(/^_/))
    .forEach(key => customKeys[key] = true);
  return Object.keys(customKeys);
};

