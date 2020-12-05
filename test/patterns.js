'use strict';

const { _, expect, definePattern } = require('./matchers');

definePattern('ISOdateString', /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/);
definePattern('JWT', /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);
definePattern('DID', /^did:jlinc:.+$/);

definePattern('jsonStringMatching', (json, pattern) => {
  let object;
  try{ object = JSON.parse(json); }catch(e){ return false; };
  expect(object).to.matchPattern(pattern);
});

definePattern('JSON', json => {
  expect(json).to.be.a('string');
  try{ JSON.parse(json); return true; }
  catch(e){ return false; }
});

definePattern('dateLessThanXAgo', (date, delta) =>
  _.isDate(date) && date >= Date.now() - delta
);

definePattern('recentDate', date =>
  _.isDateLessThanXAgo(1000)(date)
);

definePattern('includedIn', (target, set) => {
  return [...set].includes(target);
});
