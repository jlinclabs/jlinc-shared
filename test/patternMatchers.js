'use strict';

const util = require('util');
const chai = require('chai');
const chaiMatchPattern = require('chai-match-pattern');
const matchPattern = require('lodash-match-pattern');
chai.use(chaiMatchPattern);
const _ = chaiMatchPattern.getLodashModule();

const inspect = object =>
  util.inspect(object)
    .replace(/\[Function: is(.+?)\]/, (s, m) => `is${m}` in _ ? `_.is${m}` : s);

Object.entries({
  matchesPattern(pattern){
    return target => matchPattern(target, normalizePatternFunction(pattern)) === null;
  },
  isEvery(...patterns){
    return target => patterns.every(pattern => _.matchesPattern(pattern)(target));
  },
  isSome(...patterns){
    return target => patterns.some(pattern => _.matchesPattern(pattern)(target));
  },
}).forEach(function([key, value]){
  _.mixin({
    [key]: function(...patterns){
      const matcher = value(...patterns);
      // Note we can't have _. infront of the key here because lodash-match-pattern normalize line 26 will be upset
      matcher.toString = () => `${key}(${patterns.map(inspectPattern).join(', ')})`;
      return matcher;
    },
  });
});

function regExpPatternToFunction(regExp){
  return string => _.isString(string) && regExp.test(string);
}

function inspectPattern(pattern){
  if (_.isFunction(pattern)) {
    if (_[pattern.name] === pattern) return `_.${pattern.name}`;
    return pattern.name || pattern.toString();
  }
  return inspect(pattern)
    .replace(/\[Function: is(.+?)\]/, (s, m) => `is${m}` in _ ? `_.is${m}` : s);
}

function normalizePatternFunction(pattern){
  if (_.isRegExp(pattern)) return regExpPatternToFunction(pattern);
  if (_.isFunction(pattern)) return target => {
    try{
      const result = pattern(target);
      return result === undefined ? true : !!result;
    }catch(error){
      if (error instanceof chai.AssertionError) return false;
      throw error;
    }
  };

  return pattern;
}


const definePattern = (aName, pattern) => {
  const isName = definePattern.isName(aName);
  if (_.isRegExp(pattern)) pattern = regExpPatternToFunction(pattern);
  const patternIsAFunction = _.isFunction(pattern);
  const patternTakesOptions = patternIsAFunction && pattern.length > 1;

  let isMethod, aMethod;
  if (patternIsAFunction){
    aMethod = function(target, ...args){
      try{
        return pattern(target, ...args) !== false ? null : '';
      }catch(error){
        if (error instanceof chai.AssertionError) return `${error}`;
        throw error;
      }
    };

    isMethod = patternTakesOptions
      ? (...args) => {
        isMethod = target => aMethod(target, ...args) === null;
        isMethod.toString = () => `${isName}(${args.map(inspect).join(', ')})`;
        return isMethod;
      }
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
      `expected #{this} to match pattern ${aName}${error}`,
      `expected #{this} to not match pattern ${aName}${error}`,
      this._obj,
    );
  });

};

const capitalize = string => string[0].toUpperCase() + string.substr(1);

definePattern.isName = function(patternName){
  return patternName.match(/^an?([A-Z]\w.+)$/)
    ? `is${RegExp.$1}`
    : `is${capitalize(patternName)}`
  ;
};



module.exports = { inspect, _, matchPattern, definePattern, chai };
