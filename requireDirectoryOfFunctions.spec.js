
'use strict';

const Path = require('path');

const logger = require('./logger')(__filename);
const requireDirectoryOfFunction = require('./requireDirectoryOfFunctions');
const TEST_DIRECTORIES_PATH = Path.resolve('./test/directoriesOfFunctions');

require('./logger.matchers');

const pogCollection = {pogs: 'rule'};
const cats = ['Samson', 'Hitch'];

describe('requireDirectoryOfFunctions', function(){
  it('should work', async function(){
    const cows = require(TEST_DIRECTORIES_PATH + '/cows');

    expect(cows).to.matchPattern({
      bessy: _.isFunction,
      albert: _.isFunction,
      larry: _.isFunction,
      mo: _.isFunction,
      proxy: _.isFunction,
      harvey: undefined,
      harveyFox: undefined,
    });

    expect(()=>{cows.bessy();}).to.throw('Cow:bessy requires logger');
    expect(()=>{cows.larry();}).to.throw('Cow:larry requires logger');
    expect(()=>{cows.mo();}).to.throw('Cow:mo requires logger');

    expect(await cows.bessy({ logger, pogCollection })).to.matchPattern(
      ['BessyCow', [{logger: _.isInstanceOfLogger, pogCollection}], undefined]
    );
    expect(await cows.albert({ logger, cats })).to.matchPattern(
      ['AlbertCow', [{logger: _.isInstanceOfLogger, cats}], undefined]
    );
    expect(await cows.proxy({ logger, cats })).to.matchPattern(
      ['ProxyCow', ['BessyCow', [{logger: _.isInstanceOfLogger, cats}], undefined]]
    );
    await expect(cows.larry({ logger })).to.be.rejectedWith('LarryCow threw this error');
    await expect(cows.mo({ logger })).to.be.rejectedWith('MoCow threw this error');
  });
  describe('pathToClassName', function(){
    it('should support different english plural styles', function(){
      const { pathToClassName } = requireDirectoryOfFunction;
      expect(pathToClassName).to.be.a('function');
      expect(pathToClassName('/foo/bar/queries')).to.equal('Query');
      expect(pathToClassName('/foo/bar/commands')).to.equal('Command');
      expect(pathToClassName('/foo/bar/middlewares')).to.equal('Middleware');
    });
  });
});
