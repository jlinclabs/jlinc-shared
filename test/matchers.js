'use strict';

const chai = require('chai');
const chaiMatchPattern = require('chai-match-pattern');
const matchPattern = require('lodash-match-pattern');
chai.use(chaiMatchPattern);
const expect = chai.expect;
const _ = chaiMatchPattern.getLodashModule();

const definePattern = (patternName, pattern) => {
  const name = patternName[0].toUpperCase() + patternName.substr(1);
  const isName = `is${name}`;
  const aName = (/[AEIOU]/.test(name[0]) ? 'an' : 'a') + name;

  const isMethod = target => matchPattern(target, pattern) === null;;
  isMethod.pattern = pattern;
  isMethod.toString = () => `definePattern('${patternName}')`;

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
  _,
  chai,
  expect,
  definePattern,
};
