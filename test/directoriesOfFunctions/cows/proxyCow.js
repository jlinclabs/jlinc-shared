'use strict';

const cows = require('../cows');

module.exports = async function ProxyCow(...args){
  return ['ProxyCow', await cows.bessy(...args)];
};

