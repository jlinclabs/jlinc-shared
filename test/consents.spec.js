'use strict';

const VALID_CONSENT_KEYS = require('../consents');
const CONSENT_CATEGORIES = require('../consent_categories');

describe('consents', function() {
  context('when all consent keys are in consent categories in the correct order', function() {
    it('should not throw an error', function() {
      const consents = [...VALID_CONSENT_KEYS];
      Object.keys(CONSENT_CATEGORIES).forEach(category => {
        CONSENT_CATEGORIES[category].forEach(consent => {
          if (consents[0] !== consent) {
            throw new Error(`invalid consent order starting with consent: "${consent}" in category: "${category}"`);
          }
          consents.shift();
        });
      });
      if (consents.length !== 0) {
        throw new Error(`missing consents in consent categories: "${JSON.stringify(consents)}"`);
      }
    });
  });
});
