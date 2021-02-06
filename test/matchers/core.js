'use strict';

const { chai, _, expect, definePattern } = require('./helpers');

definePattern('aURL',
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
);

definePattern('aDID', /^did:jlinc:.+$/);

definePattern('aJsonStringMatching', (json, pattern) => {
  expect(json).to.be.JSON();
  expect(JSON.parse(json)).to.matchPattern(pattern);
});

definePattern('JSON', json => {
  expect(json).to.be.a('string');
  try{
    JSON.parse(json);
  }catch(error){
    throw new chai.AssertionError(`invalid JSON "${json}"`, { json }, error);
  }
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
