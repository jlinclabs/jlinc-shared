'use strict';

const setNullOrFalseToUndefined = require('./setNullOrFalseToUndefined');

describe('PNFO', function(){
  it('should be a function', function(){
    expect(setNullOrFalseToUndefined).to.be.a('function');
  });
  it('should return a new object where any props whos value is null or false is now undefined', function(){
    expect(setNullOrFalseToUndefined({})).to.deep.equal({});
    expect(setNullOrFalseToUndefined({a:1})).to.deep.equal({a:1});
    expect(setNullOrFalseToUndefined({
      a: 1,
      b: '',
      c: 0,
      d: null,
      e: false,
    })).to.deep.equal({
      a: 1,
      b: '',
      c: 0,
      d: undefined,
      e: undefined,
    });
  });
});
