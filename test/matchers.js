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

  const dynamicPattern = patternReturnsAFunction(pattern);

  function something(matchPattern){
    try{
      return undefinedToTrue(matchPattern());
    }catch(error){
      if (error instanceof chai.AssertionError) return false;
      throw error;
    }
    return true;
  }

  const isMethod = dynamicPattern
    ? (...args) => target => something(() => pattern(...args)(target))
    : target => something(() => matchPattern(target, fuck(pattern)) === null)
  ;

  isMethod.pattern = pattern;
  isMethod.toString = () => `${isName}()`;

  _.mixin({
    [isName]: isMethod,
    // [isName]: dynamicPattern
    //   ? (...args) => decorateIsMethod(target => {
    //     const dynamicPattern = pattern(...args);
    //     try{
    //       return undefinedToTrue(dynamicPattern(target));
    //     }catch(error){
    //       console.error('xxx', error)
    //       if (error instanceof chai.AssertionError) return false;
    //       throw error;
    //     }
    //     return true;
    //   })
    //   : decorateIsMethod(target => matchPattern(target, fuck(pattern)) === null)
  });

  chai.Assertion.addMethod(aName, function(...args){
    if (dynamicPattern) {
      // this case does not respect the chai negation (not) flag
      let error;
      try {
        pattern(...args)(this._obj);
      } catch(e){
        error = e;
      } finally {
        this.assert(
          !error,
          error && `${error.message} in pattern ${patternName}`,
          `expected #{this} to not match pattern ${patternName}`,
          this._obj,
        );
      }
    } else {
      const obj = this._obj;

      const check = matchPattern(obj, fuck(pattern));
      this.assert(
        !check,
        check && `${check} in pattern ${patternName}`,
        `expected #{this} to not match ${patternName}: ${check}`,
        obj
      );
    }
  });
};

const fuck = pattern =>
  typeof pattern === 'function'
    ? target => undefinedToTrue(pattern(target))
    : pattern;

function patternReturnsAFunction(pattern){
  try{
    return _.isFunction(pattern) && _.isFunction(pattern());
  }catch(e){}
}


definePattern('dateString', /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/);

// _.mixin({});

const undefinedToTrue = value =>
  typeof value === 'undefined' ? true : value;

module.exports = {
  _,
  chai,
  expect,
  definePattern,
  matchPattern,
};

