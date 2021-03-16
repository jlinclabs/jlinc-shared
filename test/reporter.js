'use strict';
/* eslint no-console: 0 */

const Path = require('path');
const inherits = require('util').inherits;
const { Base, Spec } = require('mocha').reporters;

const { color } = Base;
const projectRootPath = require('../projectRootPath');

const Reporter = function(runner) {
  Spec.call(this, runner);
  const failures = [];
  runner.on('fail', function(test) {
    failures.push(test);
    Base.list([test]);
  });
  runner.on('end', function() {
    if (failures.length === 0) return;
    const paths = extractPathsFromFailures(failures);
    console.log(color('fail', 'TESTS THAT FAILED:'));
    Object.values(paths).forEach(relativePathWithLineNumber => {
      console.log(color('error stack', `  ${relativePathWithLineNumber}`));
    });
    console.log('');
    console.log(color('fail', 'RUN FAILED TESTS:'));
    console.log(color('error stack', `  mocha ${Object.keys(paths).join(' ')}`));
    console.log('');
  });
};

inherits(Reporter, Spec);

exports = module.exports = Reporter;

function findFailedTestFilePath(test){
  while (true){
    if (test.file) return test.file;
    if (test.parent) test = test.parent;
    else break;
  }
}

function extractPathsFromFailures(failures){
  const paths = {};
  failures.forEach(test => {
    let specPath;
    let lineNumber;
    test.err.stack.split(/\n/).forEach(line => {
      if (specPath && lineNumber) return;
      if (line.indexOf(projectRootPath) === -1) return;
      const matches = line.match(/\((\/.+?.spec.js)(:(\d+))?(:\d+)?\)/);
      if (!matches) return;
      specPath = matches[1];
      lineNumber = matches[3];
    });
    if (!specPath) specPath = findFailedTestFilePath(test);
    if (!specPath) {
      console.warn('!!CANT FIND FAILING TEST LINE!!!', test);
      console.error(test.err);
      return;
    }
    const relativePath = Path.relative(projectRootPath, specPath);
    paths[relativePath] = lineNumber ? `${relativePath}:${lineNumber}` : relativePath;
  });
  return paths;
}
