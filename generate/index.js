#!/usr/bin/env node
/* eslint no-console  : 0 */

'use strict';

const fs = require('fs');
const Path = require('path');
const chalk = require('chalk');
const program = require('commander');

program
  .version('0.0.1');

program
  .command('query <name>')
  .action(generateQuery);

program
  .command('command <name>')
  .action(generateCommand);

program.parse(process.argv);

function generateFile(relativePath, lines){
  const absolutePath = Path.resolve(process.cwd(), relativePath);
  if (fs.existsSync(absolutePath)){
    console.log(chalk.yellow('skipping'), relativePath, chalk.yellow('(already exists)'));
    return;
  }

  console.log(chalk.green('generating'), relativePath);
  fs.writeFileSync(absolutePath, lines.join("\n"));
}

function generate(suffix, collection, name){
  if (RegExp(`^(\\w+)${suffix}$`).test(name)) name = RegExp.$1;

  generateFile(
    `${collection}/${name}${suffix}.js`,
    [
      `'use strict';`,
      ``,
      `module.exports = async function ${name}({logger, client}){`,
      ``,
      `};`,
      ``,
    ]
  );

  generateFile(
    `test/${collection}/${name}${suffix}.spec.js`,
    [
      `'use strict';`,
      ``,
      `const ${collection} = require('../../${collection}');`,
      ``,
      `describe('${suffix}: ${name}', function() {`,
      ``,
      `  it('should exist', async function(){`,
      `    expect(${collection}.${name}).to.be.a('function');`,
      `  });`,
      ``,
      `  it('should have more tests');`,
      ``,
      `});`,
      ``,
    ],
  );
}

function generateQuery(name){
  generate('Query', 'queries', name);
}

function generateCommand(name){
  generate('Command', 'commands', name);
}
