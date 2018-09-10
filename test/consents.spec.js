'use strict';

const CONSENTS = require('../consents');

describe('consents', function() {
  it('should not have duplicates', function() {
    for (const consent of CONSENTS){
      expect(CONSENTS.filter(c => c === consent)).to.have.lengthOf(1);
    }
  });
});
