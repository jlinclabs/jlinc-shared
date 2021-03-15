'use strict';

const logger = require('./logger')(__filename);
const { testPatternWithoutOptions } = require('./test/helpers');

require('./logger.matchers');

describe('logger.matchers', function(){

  testPatternWithoutOptions(
    'anInstanceOfLogger',
    [
      logger,
      logger.prefix('whatever'),
      logger.prefix('a').prefix('b').prefix('c'),
    ],
    [
      console,
      {},
      {...logger},
    ],
  );

});
