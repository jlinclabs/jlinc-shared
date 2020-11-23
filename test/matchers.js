'use strict';

const chai = require('chai');

const definePattern = (name, pattern) => {
  name = name[0].toUpperCase() + name.substr(1);
  const isName = `is${name}`;
  const aName = (/[AEIOU]/.test(name[0]) ? 'an' : 'a') + name;

  const isMethod = target => matchPattern(target, pattern) === null;
  isMethod.name = name;
  isMethod.pattern = pattern;

  // console.log(`defining _.${isName}`)
  _.mixin({[isName]: isMethod});

  // console.log(`defining expect(x).to.be.${aName}`, pattern)
  chai.Assertion.addMethod(aName, function(){
    const not = this.__flags.negate ? 'not ' : '';
    try{
      if (not){
        expect(this._obj).to.not.matchPattern(pattern);
      }else{
        expect(this._obj).to.matchPattern(pattern);
      }
    }catch(error){
      error.message = `expected to ${not}match pattern "${aName}": ${error.message}`;
      throw error;
    }
  });
};

definePattern('dateString', /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/);

// _.mixin({});

module.exports = {
  definePattern,
};
