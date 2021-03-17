'use strict';

const {
  testPatternWithoutOptions,
} = require('./test/helpers');

const assetsMatchers = require('./assets.matchers');

describe('assets.matchers', function(){

  context('when ASSETS_SERVER_URL is set', function(){
    const ASSET_SERVER_URL = 'http://fake-assets.test:8081';
    beforeEach(function(){
      assetsMatchers.ASSETS_SERVER_URL = ASSET_SERVER_URL;
    });
    testPatternWithoutOptions(
      'anAssetUrl',
      [
        `${ASSET_SERVER_URL}/8b0d4930-3f1c-11eb-a3b5-77340b7774db.svg`,
        `${ASSET_SERVER_URL}/d9967350-e88d-11ea-9977-1fe4b7062307.jpg`,
        `${ASSET_SERVER_URL}/d9967350-e88d-11ea-9977-1fe4b7062307.png`,
      ],
      [
        undefined, null, false,
        12, '', 'a', 'thisislongerthanthirtycharacters',
        'no_underscores', 'also-no-dashes',
      ],
    );
  });

  context('when ASSETS_SERVER_URL is not set', function(){
    beforeEach(function(){
      assetsMatchers.ASSETS_SERVER_URL = undefined;
    });
    it('should throw an error', function() {
      expect(() => { _.isAssetUrl('x'); })
        .to.throw('you must set ASSETS_SERVER_URL before using jlinc-shared/assets.matchers');
      expect(() => { expect('x').to.be.anAssetUrl(); })
        .to.throw('you must set ASSETS_SERVER_URL before using jlinc-shared/assets.matchers');
    });
  });

});
