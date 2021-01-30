'use strict';

const {
  testPatternWithoutOptions,
  notStrings,
  notObjects,
  randomObjects,
} = require('./test/helpers');
const createUid = require('./createUid');
require('./createUid.matchers');

describe('createUid.matchers', function(){

  testPatternWithoutOptions(
    'aUID',
    [
      createUid(),
      '8e091eaa16ca02e67f0a4f38a0c97c48',
    ],
    [
      ...notStrings(),
      ...notObjects(),
      ...randomObjects(),
    ],
  );

});
