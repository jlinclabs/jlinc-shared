'use strict';

const Path = require('path');
const util = require('util');
const chai = require('chai');
const AssertionError = require('assertion-error');
const chaiMatchPattern = require('chai-match-pattern');
const matchPattern = require('lodash-match-pattern');

chai.use(chaiMatchPattern);
chai.use(require('chai-string'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-http'));

const _ = (() => {
  const lodash = chaiMatchPattern.getLodashModule();
  lodash.mixin = lodash.mixin.bind(lodash);
  const proxy = new Proxy(lodash, {
    get(_, prop){
      if (
        typeof prop === 'symbol' ||
        prop in lodash ||
        ['inspect'].includes(prop)
      ) return Reflect.get(...arguments);
      throw new Error(`_.${prop} is not defined!`);
    },
    set(){
      throw new Error('Setting on _ directly is forbidden. Use _.mixin({})');
    }
  });
  return proxy;
})();

const inspect = object =>
  util.inspect(object)
    .replace(/\[Function: is(.+?)\]/g, (s, m) => `is${m}` in _ ? `_.is${m}` : s);

Object.entries({
  isEvery(...patterns){
    if (
      patterns.length === 0 ||
      patterns.some(p => typeof p === 'undefined')
    )
      throw new Error('_.isEvery given undefined pattern');
    return target => patterns.every(pattern => _.matchesPattern(pattern)(target));
  },
  isSome(...patterns){
    if (
      patterns.length === 0 ||
      patterns.some(p => typeof p === 'undefined')
    )
      throw new Error('_.isSome given undefined pattern');
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

const REPO_ROOT = Path.resolve(__dirname, '../..');
const getSpecCaller = () =>
  (new Error).stack.split('\n')
    .find(l => l.match(/(\/.+\.spec\.js:\d+)/))
      ? Path.relative(REPO_ROOT, RegExp.$1)
      : '[unknown file]'
;

_.mixin({
  matchesPattern(pattern){
    if (typeof pattern === 'undefined')
      throw new Error('_.matchesPattern given undefined');

    const isMethod = (
      _.isFunction(pattern) ? target => catchAssertionErrors(() => pattern(target) !== false) :
      _.isRegExp(pattern) ? target => _.isString(target) && pattern.test(target) :
      target => typeof pattern === typeof target && matchPattern(target, pattern) === null
    );

    const sourceLine = getSpecCaller();
    isMethod.toString = () => `(${sourceLine})`;
    return isMethod;
  },
  isOneOf: _.isSome,
  isAll: _.isEvery,
  isUndefinedOr(pattern){
    if (typeof pattern === 'undefined')
      throw new Error('_.isUndefinedOr cannot be given undefined');
    const matcher = target =>
      _.isUndefined(target) || _.matchesPattern(pattern)(target);
    matcher.toString = () => `isUndefinedOr(${inspectPattern(pattern)})`;
    return matcher;
  },
});

function inspectPattern(pattern){
  if (_.isFunction(pattern)) {
    if (
      pattern.name in _ &&
      _[pattern.name] === pattern
    ) return `_.${pattern.name}`;
    return pattern.name || pattern.toString();
  }
  return inspect(pattern)
    .replace(/\[Function: is(.+?)\]/, (s, m) => `is${m}` in _ ? `_.is${m}` : s);
}

function catchAssertionErrors(block){
  try{ return block(); }catch(error){
    if (error instanceof AssertionError) return false;
    throw error;
  }
}

const inspectArgs = args => args.map(inspect).join(', ');

const createPattern = pattern => {
  if (typeof pattern === 'undefined') throw new Error('pattern is required');

  const patternIsAFunction = _.isFunction(pattern);
  const patternTakesOptions = patternIsAFunction && pattern.length > 1;

  const expectStrategy = (
    patternIsAFunction ? (...args) => {
      const result = pattern(...args);
      if (result === false) throw new AssertionError(`matcher returned false`);
      if (result === true || result === undefined) return;
      throw new Error(`pattern function returned something weird: ${inspect(result)}`);
    } :
    _.isString(pattern) ? target => {
      expect(target).to.equal(pattern);
    } :
    _.isRegExp(pattern) ? target => {
      expect(target).to.be.a('string');
      expect(target).to.match(pattern);
    } :
    target => {
      expect(target).to.be.a(Array.isArray(pattern) ? 'array' : typeof pattern);
      expect(target).to.matchPattern(pattern);
    }
  );

  const expectMethod = (target, ...args) => {
    try{
      expectStrategy(target, ...args);
    }catch(error){
      if (!(error instanceof AssertionError)) throw error;
      throw new AssertionError(
        (
          `${inspect(target)} didn't match target ${isMethod.patternName}` +
          (patternTakesOptions ? `(${inspectArgs(args)})` : '') +
          `: error=${error}`
        ),
        {pattern, parentError: error},
      );
    }
  };

  const matchesPattern = (target, ...args) =>
    catchAssertionErrors(() => {
      expectMethod(target, ...args);
      return true;
    });

  const isMethod = patternTakesOptions
    ? (...args) => {
      const dynamicIsMethod = target => matchesPattern(target, ...args);
      dynamicIsMethod.toString = () => `${isMethod.isName}(${inspectArgs(args)})`;
      return dynamicIsMethod;
    }
    : target => matchesPattern(target);

  isMethod.patternName = `${patternIsAFunction ? pattern : inspect(pattern) }`;
  isMethod.isName = `is${isMethod.patternName}`;
  isMethod.pattern = pattern;
  isMethod.expect = expectMethod;
  return isMethod;
};


const definePattern = (patternName, pattern) => {
  if (typeof patternName !== 'string' || !patternName) throw new Error('patternName is required');
  if (typeof pattern === 'undefined') throw new Error('pattern is required');
  const isName = definePattern.isName(patternName);
  if (isName in _) throw new Error(`_.${isName} already exists!`);
  if (patternName in chai.Assertion.prototype) throw new Error(`chai.Assertion.${patternName} already exists!`);

  const isMethod = createPattern(pattern);
  isMethod.patternName = patternName;
  isMethod.isName = isName;
  isMethod.toString = () => `${isName}()`;

  _.mixin({ [isName]: isMethod });

  const expectMethod = isMethod.expect;
  chai.Assertion.addMethod(patternName, function(...args){
    let error;
    try{
      expectMethod(this._obj, ...args);
    }catch(e){
      error = e.parentError || e;
    }
    const matchMessage = `match pattern ${patternName}(${inspectArgs(args)})${error ? `: ${error}` : ''}`;
    this.assert(
      !error,
      `expected #{this} to ${matchMessage}`,
      `expected #{this} to not ${matchMessage}`,
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

const { expect } = chai;

module.exports = {
  chai,
  expect,
  _,
  matchPattern,
  createPattern,
  definePattern,
  inspect,
};
