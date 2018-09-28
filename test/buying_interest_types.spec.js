'use strict';

const BUYING_INTEREST_TYPES = require('../buying_interest_types');

describe('buying_interest_types', function() {
  it('all top level keys should be unique and values should be objects', function() {
    const keys = [];
    Object.entries(BUYING_INTEREST_TYPES).forEach(([key, value]) => {
      expect(keys.includes(key)).to.be.false;
      keys.push(key);
      expect(typeof value).to.equal('object');
    });
  });

  it('second level keys must be either brands or tags with values that are an array of unique strings', function() {
    Object.values(BUYING_INTEREST_TYPES).forEach(value => {
      const keys = [];
      for (const key in value) {
        expect(keys.includes(key)).to.be.false;
        keys.push(key);
        expect(['brands', 'tags']).to.contain(key);
        expect(Array.isArray(value[key])).to.be.true;
        const secondLevelValues = [];
        value[key].forEach(secondLevelValue => {
          expect(typeof secondLevelValue === 'string').to.be.true;
          expect(secondLevelValues.includes(secondLevelValue)).to.be.false;
          secondLevelValues.push(secondLevelValue);
        });
      }
    });
  });
});