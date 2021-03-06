'use strict';

const Path = require('path');
const readDirRecursive = require('fs-readdir-recursive');

it('each file should have a spec', function() {
  const files = readDirRecursive(
    Path.resolve(__dirname, '..'),
    name => !name.match(/^(\.|tmp|node_modules$|test$|test-results$)/),
  );
  const specs = [];
  const specables = [];
  files.forEach(file => {
    const matches = file.match(/^([^.].+?)(\.spec)?\.js$/);
    if (!matches) return;
    const name = matches[1];
    if (matches[2]) specs.push(name);
    else specables.push(name);
  });

  const missingSpecs = specables
    .filter(specable => !specs.includes(specable));

  const mismatchedSpecs = specs
    .filter(spec => !specables.includes(spec));

  if (missingSpecs.length > 0 || mismatchedSpecs.length > 0)
    throw new Error(
      `META SPEC ERROR!\n` +
      (missingSpecs.length > 0
        ? `\nMissing Specs: ${JSON.stringify(missingSpecs)}`
        : ''
      ) +
      (mismatchedSpecs.length > 0
        ? `\nMismathed Specs: ${JSON.stringify(mismatchedSpecs)}`
        : ''
      )
    );
});
