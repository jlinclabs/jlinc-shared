'use strict';

const CONSENT_CATEGORIES = require('../consent_categories');
const CONSENTS = require('../consents');

describe('consent_categories', function() {
  it('should contain each consent only once and in the same order', function() {
    const consentsFromConsentCategories = Object.values(CONSENT_CATEGORIES)
      .reduce((consents, category) => ([...consents, ...category]));
    expect(consentsFromConsentCategories).to.deep.equal(CONSENTS);
  });
});
