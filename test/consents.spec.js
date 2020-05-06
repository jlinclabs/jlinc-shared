'use strict';

const VALID_CONSENT_KEYS = require('../consents');

describe('consents', function() {
  it('should not have duplicates', function() {
    for (const consent of VALID_CONSENT_KEYS){
      expect(VALID_CONSENT_KEYS.filter(c => c === consent)).to.have.lengthOf(1);
    }
  });
});
