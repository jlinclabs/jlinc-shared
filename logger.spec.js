'use strict';

const util = require('util');
const colors = require('colors/safe');
const createLogger = require('./logger');
const { indent, humanizeJsonLog, Logger } = createLogger;

describe('logger', function(){
  describe('humanizeJsonLog', function(){
    it('should huanize json', function(){
      const json = {
        app: 'foobar',
        context: { xId: 18 },
        trace: 'a->b->c',
        level: 'warn',
        message: [
          'this is a string',
          Array(10).fill().map(Math.random)
        ]
      };
      expect(
        colors.strip(
          humanizeJsonLog(JSON.stringify(json))
        )
      ).to.deep.equal(
        `foobar warn a->b->c { xId: 18 }\n` +
        indent(util.inspect(json.message, { colors: false, depth: Infinity }))
      );
    });
  });
  describe('Logger', function(){
    it('should be a function', function(){
      expect(createLogger).to.be.a('function');
      expect(Logger).to.be.a('function');
      const logger1 = createLogger('logger1');
      expect(logger1).to.be.an.instanceof(Logger);
      expect(`${logger1}`).to.equal(`Logger(logger1)`);
      const logger2 = logger1.ctx('logger2');
      expect(logger2).to.be.an.instanceof(Logger);
      expect(`${logger2}`).to.equal(`Logger(logger1→logger2)`);
      const error = new Error(`fake error`);
      error.extra = {thisShouldBeStripped: 'truthy'};
      logger2.error(error);
      logger2.error('oh no!', error);
      logger2.info(['a','b', error]);
    });
  });
});
