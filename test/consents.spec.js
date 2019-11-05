'use strict';

const VALID_CONSENT_KEYS = require('../consents');
const VALID_CARBONPATH_CONSENT_KEYS = require('../carbonpath_consents');

describe('consents', function() {
  it('should not have duplicates', function() {
    for (const consent of VALID_CONSENT_KEYS){
      expect(VALID_CONSENT_KEYS.filter(c => c === consent)).to.have.lengthOf(1);
    }
  });
});

describe('carbon consents', function() {
  it('should all be valid consents', function() {
    for (const consent of VALID_CARBONPATH_CONSENT_KEYS) {
      expect(VALID_CONSENT_KEYS.includes(consent)).to.be.true;
    }
  });
});
