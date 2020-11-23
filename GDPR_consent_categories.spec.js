'use strict';

const GDPR_CONSENT_CATEGORIES = require('./GDPR_consent_categories');
const GDPR_CONSENTS = require('./GDPR_consents');

describe('GDPR_consent_categories', function() {
  it('should contain each consent only once and in the same order', function() {
    const GDPRConsents = Object.values(GDPR_CONSENT_CATEGORIES)
      .reduce((consents, category) => ([...consents, ...category]));
    expect(GDPRConsents).to.deep.equal(GDPR_CONSENTS);
  });

  it('should be deeply frozen', function(){
    expect(GDPR_CONSENT_CATEGORIES).to.be.frozen;
    Object.values(GDPR_CONSENT_CATEGORIES).forEach(value => {
      expect(value).to.be.frozen;
    });
  });
});
