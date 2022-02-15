#!/usr/bin/env node

'use strict';
/* eslint no-console: 0 */

const readline = require('readline');
const colors = require('colors/safe');
const { LEVEL, MESSAGE } = require('triple-beam');
const { consoleFormat } = require('./logger');

const rl = readline.createInterface({ input: process.stdin });

rl.on('line', json => {
  try{
    const info = JSON.parse(json);
    info[LEVEL] = info.level;
    const formatted = consoleFormat.transform(info);
    process.stdout.write(
      colors.bold(colors.red(info.app)) + ' ' + formatted[MESSAGE] + '\n'
    );
  }catch(error){
    console.error(`error parsing JSON log line`, error, json);
  }
});
