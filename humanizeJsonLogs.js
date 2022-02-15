#!/usr/bin/env node

'use strict';
/* eslint no-console: 0 */

const readline = require('readline');
const { humanizeJsonLog } = require('./logger');

const rl = readline.createInterface({ input: process.stdin });

rl.on('line', json => {
  try{
    console.log(humanizeJsonLog(json));
  }catch(error){
    console.error(`error parsing JSON log line`, error, json);
  }
});
