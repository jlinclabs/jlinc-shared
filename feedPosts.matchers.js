'use strict';


const matchers = require('./test/matchers');

const {
  _,
  // chai,
  // expect,
  definePattern,
} = matchers;

definePattern('feedPostUid', target =>
  _.isString(target) && target.length === 32
);
definePattern('feedPost', {

});


module.exports = {
  ...matchers,
};
