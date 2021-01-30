'use strict';

const { _, definePattern } = require('./helpers');

definePattern(
  'anISODateString',
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
);

definePattern('aDateLessThanXAgo', (date, delta) =>
  _.isDate(date) && date >= Date.now() - delta
);

definePattern('aRecentDate', date =>
  _.isDateLessThanXAgo(1000)(date)
);

definePattern('aRecentISODateString', date =>
  _.isISODateString(date) &&
  _.isRecentDate(new Date(date))
);

definePattern(
  'aFullTimestamp',
  /^\w+, \w+ \d+\w\w \d\d\d\d, \d+:\d+:\d+(am|pm)$/,
);

definePattern(
  'aDateOrAnISODateString',
  _.isSome(
    _.isDate,
    _.isISODateString,
  )
);
