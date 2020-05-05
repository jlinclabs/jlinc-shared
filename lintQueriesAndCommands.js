#!/usr/bin/env node

/* eslint no-console: 0 */
'use strict';

const fs = require('fs');
const Path = require('path');
const chalk = require('chalk');

function getFiles(path, regexp){
  return fs.readdirSync(Path.resolve(process.cwd(), path))
    .map(file => file.match(regexp) && RegExp.$1)
    .filter(name => !!name)
    .sort();
}

const missingSpecs = [];
const mismatchedSpecs = [];
const specsWithBadMochaDescription = [];

function checkSpecs(area, suffix){
  const prodNames = getFiles(`${area}`, RegExp(`^(\\w+${suffix}).js$`));
  const specNames = getFiles(`test/${area}`, RegExp(`^(\\w+${suffix}).spec.js$`));

  const toPath = name => `./test/${area}/${name}.spec.js`;

  prodNames
    .filter(name => !specNames.includes(name))
    .forEach(name => missingSpecs.push(toPath(name)));

  specNames
    .filter(name => !prodNames.includes(name))
    .forEach(name => mismatchedSpecs.push(toPath(name)));

  specNames.forEach(name => {
    const path = toPath(name);
    const source = fs.readFileSync(path).toString();
    const match = /^(describe\(.+)$/m.exec(source);
    const expected = `describe('${suffix}: ${name.slice(0, suffix.length * -1)}', function() {`;
    if (!match || match[1] !== expected){
      specsWithBadMochaDescription.push([path, expected]);
    }
  });
}

checkSpecs('commands', 'Command');
checkSpecs('queries', 'Query');

if (
  missingSpecs.length === 0 &&
  mismatchedSpecs.length === 0 &&
  specsWithBadMochaDescription.length === 0
) process.exit(0);

if (missingSpecs.length){
  console.warn(chalk.red(`The following specs are missing:`));
  missingSpecs.forEach(spec => {
    console.warn(`  ${spec}`);
  });
}

if (mismatchedSpecs.length){
  console.warn(chalk.red(`The following specs are mismatched:`));
  mismatchedSpecs.forEach(spec => {
    console.warn(`  ${spec}`);
  });
}

if (specsWithBadMochaDescription.length){
  console.warn(chalk.red(`The following specs have bad descriptions:`));
  specsWithBadMochaDescription.forEach(([spec, expected]) => {
    console.warn(`  ${spec}`);
    console.warn(`    ${chalk.yellow('expected:')} ${chalk.inverse(expected)}`);
  });
}

process.exit(1);
