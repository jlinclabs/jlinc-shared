'use strict';

const buyingInterests = require('../buyingInterests');

describe('buyingInterests', function() {
  it('should have helper functions', function(){
    expect(buyingInterests).to.be.an('object');
    expect(buyingInterests.normalizeBuyingInterest).to.be.a('function');
    expect(buyingInterests.validateBuyingInterest).to.be.a('function');
  });
  describe('normalizeBuyingInterest', function() {
    const { normalizeBuyingInterest } = buyingInterests;
    it('should convert beginning_date and end_date into strings and prune keys', function(){
      expect(normalizeBuyingInterest({})).to.deep.equal({
        uid: undefined,
        type: undefined,
        organization_apikey: undefined,
        description: undefined,
        location: undefined,
        price_low: undefined,
        price_high: undefined,
        beginning_date: undefined,
        end_date: undefined,
        industry: undefined,
        currency: undefined,
        brands: [],
        tags: [],
        created: undefined,
      });

      expect(normalizeBuyingInterest({
        uid: null,
        type: null,
        organization_apikey: null,
        description: null,
        location: null,
        price_low: null,
        price_high: null,
        beginning_date: null,
        end_date: null,
        industry: null,
        currency: null,
        brands: null,
        tags: null,
        created: null,
      })).to.deep.equal({
        uid: undefined,
        type: undefined,
        organization_apikey: undefined,
        description: undefined,
        location: undefined,
        price_low: undefined,
        price_high: undefined,
        beginning_date: undefined,
        end_date: undefined,
        industry: undefined,
        currency: undefined,
        brands: [],
        tags: [],
        created: undefined,
      });

      expect(normalizeBuyingInterest({
        uid: 'thisisafakeuuid',
        type: 'business',
        organization_apikey: 'jlinclabs',
        description: 'a tiny red car with 4 doors',
        location: 'Nevada, CA',
        price_low: 1400000,
        price_high: 15000000,
        beginning_date: new Date('1982-08-23'),
        end_date: new Date('1984-08-01'),
        industry: 'automobiles',
        currency: '$',
        brands: ['myada','porche'],
        tags: new Set(['X', '4 door']),
        created: new Date('1982-08-23'),
      })).to.deep.equal({
        uid: 'thisisafakeuuid',
        type: 'business',
        organization_apikey: 'jlinclabs',
        description: 'a tiny red car with 4 doors',
        location: 'Nevada, CA',
        price_low: 1400000,
        price_high: 15000000,
        beginning_date: '1982-08-23',
        end_date: '1984-08-01',
        industry: 'automobiles',
        currency: '$',
        brands: ['myada','porche'],
        tags: ['X', '4 door'],
        created: new Date('1982-08-23'),
      });
    });
  });
  describe('validateBuyingInterest', function() {
    // this help simulates being given an object parsed from json
    const validateBuyingInterest = object =>
      buyingInterests.validateBuyingInterest(object ? JSON.parse(JSON.stringify(object)) : undefined);

    const generateValidBuyingInterest = () => ({
      description: 'A new pair of red shoes.',
      currency: '$',
      tags: ['red', 'blue'],
      brands: ['Nike'],
    });

    beforeEach(() => {
      expect(() => {
        validateBuyingInterest(generateValidBuyingInterest());
      }).to.not.throw().and.be.true;
    });

    it('should allow tags with one or more character', function(){
      expect(() =>
        validateBuyingInterest({
          ...generateValidBuyingInterest(),
          tags: ['x'],
        })
      ).to.not.throw();
    });


    it('should not allow empty tags', function(){
      expect(() =>
        validateBuyingInterest({
          ...generateValidBuyingInterest(),
          tags: ['x', '', 'y'],
        })
      ).to.throw('Tags can only be non-empty strings');
    });

    it('should validate a buying interest', function(){

      expect(() => validateBuyingInterest()).to.throw(`buyingInterest required`);

      expect(() => validateBuyingInterest(452)).to.throw(`buyingInterest must be an object`);

      expect(() => validateBuyingInterest({})).to.throw(`Description cannot be blank`);

      expect(() => validateBuyingInterest({
        description: 'shoe',
      })).to.throw(`Description must at least 10 characaters long`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
      })).to.throw(`Currency must be one of $,€,£,¥`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
      })).to.throw(`Tags must be an array`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: [],
      })).to.throw(`At least one tag is required`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: [123],
      })).to.throw(`Tags can only be non-empty strings`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: [''],
      })).to.throw(`Tags can only be non-empty strings`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: [null],
      })).to.throw(`Tags can only be non-empty strings`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
      })).to.not.throw();

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: '$10.00',
      })).to.throw(`Minimum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: '10.00',
      })).to.throw(`Minimum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: -11,
      })).to.throw(`Minimum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 11.34,
      })).to.throw(`Minimum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 1134,
      })).to.not.throw();

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 1134,
        price_high: -11,
      })).to.throw(`Maximum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 1134,
        price_high: 11.34,
      })).to.throw(`Maximum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 1134,
        price_high: 823,
      })).to.throw(`Maximum price must be greater than or equal to Minimum price`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 1134,
        price_high: 1134,
      })).to.not.throw();

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: new Date,
      })).to.throw(`Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: 232323,
      })).to.throw(`Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: 'yesturday',
      })).to.throw(`Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: '1982-99-99',
      })).to.throw(`Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: '1982-08-99',
      })).to.throw(`Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: '1982-08-23',
      })).to.not.throw();

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        end_date: 'yesturday',
      })).to.throw(`End date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        end_date: '1982-99-99',
      })).to.throw(`End date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        end_date: '1982-08-99',
      })).to.throw(`End date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        end_date: '1982-08-23',
      })).to.not.throw();

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: '1982-08-23',
        end_date: '1982-08-22',
      })).to.throw(`End date must greater than or equal to Beginning date`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        location: '',
      })).to.throw(`Location must be 4 or more characters`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        location: 'my feet',
      })).to.not.throw();

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        brands: '',
      })).to.throw(`Brands must be an array`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        brands: [123],
      })).to.throw(`Brands can only be non-empty strings`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        brands: ['Nike'],
      })).to.not.throw();

    });
  });
});
