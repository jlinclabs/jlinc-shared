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
    it('should validate a buying interest JSON object', function(){
      // this help simulates being given an object parsed from json
      const validateBuyingInterest = object =>
        buyingInterests.validateBuyingInterest(object ? JSON.parse(JSON.stringify(object)) : undefined);

      expect(() => validateBuyingInterest()).to.throw(Error, `buyingInterest required`);

      expect(() => validateBuyingInterest(452)).to.throw(Error, `buyingInterest must be an object`);

      expect(() => validateBuyingInterest({})).to.throw(Error, `Description cannot be blank`);

      expect(() => validateBuyingInterest({
        description: 'shoe',
      })).to.throw(Error, `Description must at least 10 characaters long`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
      })).to.throw(Error, `Currency must be one of $,€,£,¥`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
      })).to.throw(Error, `Tags must be an array`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: [],
      })).to.throw(Error, `At least one tag is required`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: [123],
      })).to.throw(Error, `Tags can only be non-empty strings`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: [''],
      })).to.throw(Error, `Tags can only be non-empty strings`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: [null],
      })).to.throw(Error, `Tags can only be non-empty strings`);

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
      })).to.throw(Error, `Minimum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: '10.00',
      })).to.throw(Error, `Minimum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: -11,
      })).to.throw(Error, `Minimum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 11.34,
      })).to.throw(Error, `Minimum price must be a positive integer`);

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
      })).to.throw(Error, `Maximum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 1134,
        price_high: 11.34,
      })).to.throw(Error, `Maximum price must be a positive integer`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        price_low: 1134,
        price_high: 823,
      })).to.throw(Error, `Maximum price must be greater than or equal to Minimum price`);

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
      })).to.throw(Error, `Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: 232323,
      })).to.throw(Error, `Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: 'yesturday',
      })).to.throw(Error, `Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: '1982-99-99',
      })).to.throw(Error, `Beginning date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        beginning_date: '1982-08-99',
      })).to.throw(Error, `Beginning date must be a valid date string`);

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
      })).to.throw(Error, `End date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        end_date: '1982-99-99',
      })).to.throw(Error, `End date must be a valid date string`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        end_date: '1982-08-99',
      })).to.throw(Error, `End date must be a valid date string`);

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
      })).to.throw(Error, `End date must greater than or equal to Beginning date`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        location: '',
      })).to.throw(Error, `Location must be 4 or more characters`);

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
      })).to.throw(Error, `Brands must be an array`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        brands: [123],
      })).to.throw(Error, `Brands can only be non-empty strings`);

      expect(() => validateBuyingInterest({
        description: 'A new pair of red shoes.',
        currency: '£',
        tags: ['X'],
        brands: ['Nike'],
      })).to.not.throw();

    });
  });
});
