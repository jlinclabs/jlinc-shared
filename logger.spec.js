'use strict';

const createLogger = require('./logger');
const { Logger } = createLogger;

describe('Logger', function(){
  it('should be a function', function(){
    expect(createLogger).to.be.a('function');
    expect(Logger).to.be.a('function');
    const logger1 = createLogger('logger1');
    expect(logger1).to.be.an.instanceof(Logger);
    expect(`${logger1}`).to.equal(`Logger('[logger1]')`);
    const logger2 = logger1.prefix('logger2');
    expect(logger2).to.be.an.instanceof(Logger);
    expect(`${logger2}`).to.equal(`Logger('[logger1][logger2]')`);
  });
});
