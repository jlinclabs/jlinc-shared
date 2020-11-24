'use strict';


const { definePattern } = require('./test/matchers');

definePattern('feedPostUid', target =>
  _.isString(target) && target.length === 32
);
definePattern('feedPost', {

});
