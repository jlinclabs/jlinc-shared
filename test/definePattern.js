'use strict';

const chai = require('chai');
const chaiMatchPattern = require('chai-match-pattern');
const matchPattern = require('lodash-match-pattern');
chai.use(chaiMatchPattern);
const _ = chaiMatchPattern.getLodashModule();

const definePattern = (patternName, pattern) => {
  const name = patternName[0].toUpperCase() + patternName.substr(1);
  const isName = `is${name}`;
  const aName = (/[AEIOU]/.test(name[0]) ? 'an' : 'a') + name;

  const patternIsAFunction = _.isFunction(pattern);
  const patternTakesOptions = patternIsAFunction && pattern.length > 1;

  let isMethod, aMethod;
  if (patternIsAFunction){
    aMethod = function(target, ...args){
      try{
        return pattern(target, ...args) !== false ? null : '';
      }catch(error){
        return `${error}`;
      }
    };

    isMethod = patternTakesOptions
      ? (...args) => target => aMethod(target, ...args) === null
      : target => aMethod(target) === null
    ;
  }else{
    aMethod = target => matchPattern(target, pattern);
    isMethod = target => aMethod(target) === null;
  }

  isMethod.pattern = pattern;
  isMethod.toString = () => `${isName}()`;
  _.mixin({ [isName]: isMethod });

  chai.Assertion.addMethod(aName, function(...args){
    const check = aMethod(this._obj, ...args);
    const error = typeof check === 'string' ? `: ${check}` : '';
    this.assert(
      check === null,
      `expected #{this} to match pattern ${patternName}${error}`,
      `expected #{this} to not match pattern ${patternName}${error}`,
      this._obj,
    );
  });

};

module.exports = definePattern;
