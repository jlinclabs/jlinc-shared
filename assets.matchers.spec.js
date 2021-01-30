'use strict';

const {
  testPatternWithoutOptions,
} = require('./test/helpers');

require('./assets.matchers');

describe('assets.matchers', function(){

  testPatternWithoutOptions(
    'anAssetUrl',
    [
      'http://fake-assets.test:8081/8b0d4930-3f1c-11eb-a3b5-77340b7774db.svg',
      'http://fake-assets.test:8081/d9967350-e88d-11ea-9977-1fe4b7062307.jpg',
      'http://fake-assets.test:8081/d9967350-e88d-11ea-9977-1fe4b7062307.png',
    ],
    [
      12, '', 'a', 'thisislongerthanthirtycharacters',
      'no_underscores', 'also-no-dashes',
    ],
  );

});
