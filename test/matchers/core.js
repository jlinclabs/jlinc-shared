'use strict';

const { chai, _, expect, definePattern } = require('./helpers');

definePattern('aURL',
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
);

definePattern('aDID', /^did:jlinc:.+$/);

definePattern('aJsonStringMatching', (json, pattern) => {
  let object;
  try{ object = JSON.parse(json); }catch(e){ return false; };
  expect(object).to.matchPattern(pattern);
});

definePattern('JSON', json => {
  expect(json).to.be.a('string');
  try{ JSON.parse(json); return true; }
  catch(e){ return false; }
});

definePattern('includedIn', (target, set) =>
  [...set].includes(target)
);

definePattern('trueOrUndefined', value =>
  value === true || value === undefined
);

definePattern('stringOrNull', _.isOneOf(_.isString, _.isNull));
definePattern('stringOrUndefined', _.isUndefinedOr(_.isString));

chai.Assertion.addMethod('aPlainObject', function(){
  this.assert(
    _.isPlainObject(this._obj),
    `expected #{this} to be a plain object`,
    `expected #{this} to not be a plain object`,
    this._obj,
  );
});
