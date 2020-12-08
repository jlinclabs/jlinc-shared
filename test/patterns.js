'use strict';

const { _, expect, definePattern } = require('./matchers');

definePattern('anISOdateString', /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/);
definePattern('aJWT', /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);
definePattern('aDID', /^did:jlinc:.+$/);
definePattern('anOrganizationApikey', /^[a-z]{2,30}$/i);


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

definePattern('aDateLessThanXAgo', (date, delta) =>
  _.isDate(date) && date >= Date.now() - delta
);

definePattern('aRecentDate', date =>
  _.isDateLessThanXAgo(1000)(date)
);

definePattern('includedIn', (target, set) =>
  [...set].includes(target)
);

definePattern('trueOrUndefined', value =>
  value === true || value === undefined
);
