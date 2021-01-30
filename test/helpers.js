'use strict';

const { _, expect, definePattern, inspect } = require('./matchers');

const inspectOneLine = object => inspect(object).replace(/\n/g, '');

function testPattern(aName, isTests, matcherTests){
  const isName = definePattern.isName(aName);
  describe(`_.${isName}`, function(){
    it('should be a function', function(){
      expect(_[isName]).to.be.a('function');
    });
    isTests(isName);
  });

  describe(`expect().to.be.${aName}`, function(){
    it('should be a chai matcher', function(){
      expect(expect().to.be[aName]).to.be.a('function');
    });
    matcherTests(aName);
  });
}

function testPatternWithoutOptions(patternName, trues, fales){
  testPattern(
    patternName,
    function(isName){
      const matcher = _[isName];
      it('should throw a nice error when it fails', function(){
        expect(matcher.toString()).to.equal(`${isName}()`);
        expect(() => {
          expect(fales[0]).to.matchPattern(matcher);
        }).to.throw(` didn't match target '${isName}()'`);
      });
      testIsMatcher(matcher, trues, fales);
    },
    function(aName){
      testChaiMatcher(aName, undefined, trues, fales);
    }
  );
}

function testIsMatcher(matcher, trues, fales){
  trues.forEach(value => {
    context(`when given ${inspectOneLine(value)}`, function(){
      it('should return true', function(){
        expect(value).to.matchPattern(matcher);
        expect(matcher(value)).to.be.true;
      });
    });
  });
  fales.forEach(value => {
    context(`when given ${inspectOneLine(value)}`, function(){
      it('should return false', function(){
        expect(matcher(value)).to.be.false;
        expect(value).to.not.matchPattern(matcher);
      });
    });
  });
}

function testChaiMatcher(aName, options, trues, fales){
  trues.forEach(value => {
    context(`when given ${inspectOneLine(value)}`, function(){
      it('should return true', function(){
        expect(value).to.be[aName](options);
      });
    });
  });
  fales.forEach(value => {
    context(`when given ${inspectOneLine(value)}`, function(){
      it('should return false', function(){
        expect(value).to.not.be[aName](options);
      });
    });
  });
}

function testPatternWithOptions(patternName, cases){
  testPattern(
    patternName,
    function(isName){
      cases.forEach(([options, trues, fales]) => {
        const expectedToString = `${isName}(${inspect(options)})`;

        context(`_.${expectedToString}`, function(){
          const matcher = _[isName](options);
          it('should throw a nice error when it fails', function(){
            expect(matcher).to.be.a('function');
            expect(matcher.toString()).to.equal(expectedToString);
            expect(() => {
              expect(fales[0]).to.matchPattern(matcher);
            }).to.throw(` didn't match target '${isName}`);
          });
          testIsMatcher(matcher, trues, fales);
        });
      });
    },
    function(aName){
      cases.forEach(([options, trues, fales]) => {
        context(`with options ${inspect(options)}`, function(){
          testChaiMatcher(aName, options, trues, fales);
        });
      });
    }
  );
}

const primatives = () => [undefined, null, true, false, Infinity];
const notStrings = () => [...primatives(), [], {}];
const notObjects = () => [...primatives(), '', 'hello', 42];

const randomObjects = () => ['', 'hello', 12, Infinity, ...notStrings()];

module.exports = {
  testPattern,
  testPatternWithoutOptions,
  testIsMatcher,
  testChaiMatcher,
  testPatternWithOptions,
  notStrings,
  notObjects,
  randomObjects,
};
