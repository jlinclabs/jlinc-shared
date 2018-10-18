'use strict';

const isValidAccountDataSectionValue = require('../isValidAccountDataSectionValue');

describe('isValidAccountDataSectionValue', function(){
  context(`when section is invalid`, function(){
    it('should throw and error', function(){
      expect(() => { isValidAccountDataSectionValue(); }).to.throw('invalid account data section: "undefined"');
      expect(() => { isValidAccountDataSectionValue(''); }).to.throw('invalid account data section: ""');
      expect(() => { isValidAccountDataSectionValue('poop'); }).to.throw('invalid account data section: "poop"');
    });
  });
  context(`when section = 'shared_personal_data'`, function(){
    it('should check if the value is a boolean', function(){
      expect( isValidAccountDataSectionValue('shared_personal_data') ).to.be.false;
      expect( isValidAccountDataSectionValue('shared_personal_data', true) ).to.be.true;
      expect( isValidAccountDataSectionValue('shared_personal_data', false) ).to.be.true;
    });
  });
  context(`when section = 'personal_data'`, function(){
    it('should check if the value is string or null', function(){
      expect( isValidAccountDataSectionValue('personal_data') ).to.be.false;
      expect( isValidAccountDataSectionValue('personal_data', null) ).to.be.false;
      expect( isValidAccountDataSectionValue('personal_data', '') ).to.be.true;
      expect( isValidAccountDataSectionValue('personal_data', 'x') ).to.be.true;
    });
  });
  context(`when section = 'consents'`, function(){
    it('should check if the value is a boolean', function(){
      expect( isValidAccountDataSectionValue('consents') ).to.be.false;
      expect( isValidAccountDataSectionValue('consents', true) ).to.be.true;
      expect( isValidAccountDataSectionValue('consents', false) ).to.be.true;
    });
  });
  context(`when section = 'communication_channels'`, function(){
    it('should check if the value an object with the key enabled with a boolean value', function(){
      expect( isValidAccountDataSectionValue('communication_channels') ).to.be.false;
      expect( isValidAccountDataSectionValue('communication_channels', true) ).to.be.false;
      expect( isValidAccountDataSectionValue('communication_channels', false) ).to.be.false;
      expect( isValidAccountDataSectionValue('communication_channels', {}) ).to.be.false;
      expect( isValidAccountDataSectionValue('communication_channels', {x:1}) ).to.be.false;
      expect( isValidAccountDataSectionValue('communication_channels', {enabled: 1}) ).to.be.false;
      expect( isValidAccountDataSectionValue('communication_channels', {enabled: true}) ).to.be.true;
      expect( isValidAccountDataSectionValue('communication_channels', {enabled: false}) ).to.be.true;
    });
  });
});
