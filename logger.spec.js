'use strict';

const createLogger = require('./logger');
const { Logger } = createLogger;

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
