'use strict';

const {
  testPatternWithoutOptions,
  testPatternWithOptions,
  notStrings,
  randomObjects,
} = require('../helpers');
require('./core');

const toJSON = JSON.stringify;

describe('matchers/core', function(){

  testPatternWithoutOptions(
    'JSON',
    ['""', '[]', '{}'],
    ['', 'hello', ...notStrings()],
  );

  testPatternWithoutOptions(
    'aDID',
    [
      'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
    ],
    ['', 'jlinc:did', 'did:', ...randomObjects()],
  );

  testPatternWithOptions(
    'aJsonStringMatching',
    [
      [
        {name: _.isString},
        [toJSON({name: 'Steve'})],
        [toJSON({color: 'red'})],
      ],
      [
        _.isString,
        ['""', '"hello"'],
        ['nope'],
      ],
    ]
  );

  testPatternWithOptions(
    'includedIn',
    [
      [
        [1, 2],
        [1, 2],
        ['please pick me', 5, 11, 22, ...randomObjects(), ...notStrings()]
      ],
      [
        new Set([1, 2]),
        [1, 2],
        ['please pick me', 5, 11, 22, ...randomObjects(), ...notStrings()]
      ]
    ]
  );


  testPatternWithoutOptions(
    'trueOrUndefined',
    [ , undefined, true],
    [null, false],
  );

});

