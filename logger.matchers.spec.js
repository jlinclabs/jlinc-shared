'use strict';

const logger = require('./logger')(__filename);
const { testPatternWithoutOptions } = require('./test/helpers');

require('./logger.matchers');

describe('logger.matchers', function(){

  testPatternWithoutOptions(
    'anInstanceOfLogger',
    [
      logger,
      logger.ctx('whatever'),
      logger.ctx('a').ctx('b').ctx('c'),
    ],
    [
      console,
      {},
      {...logger},
    ],
  );

});
