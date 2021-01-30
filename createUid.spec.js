'use strict';

const md5 = require('md5');

module.exports = function createUid(){
  return md5(`${Math.random()}${Date.now()}`);
};
