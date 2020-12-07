'use strict';

const { inspect } = require('util');
const { _, expect, definePattern } = require('./matchers');
require('./patterns');

const toJSON = JSON.stringify;

describe('patterns', function(){

  function testPattern(patternName, isTests, matcherTests){
    const { isName, aName } = definePattern.names(patternName);
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
      context(`when given ${inspect(value)}`, function(){
        it('should return true', function(){
          expect(value).to.matchPattern(matcher);
          expect(matcher(value)).to.be.true;
        });
      });
    });
    fales.forEach(value => {
      context(`when given ${inspect(value)}`, function(){
        it('should return false', function(){
          expect(matcher(value)).to.be.false;
          expect(value).to.not.matchPattern(matcher);
        });
      });
    });
  }
  function testChaiMatcher(aName, options, trues, fales){
    trues.forEach(value => {
      context(`when given ${inspect(value)}`, function(){
        it('should return true', function(){
          expect(value).to.be[aName](options);
        });
      });
    });
    fales.forEach(value => {
      context(`when given ${inspect(value)}`, function(){
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
          context(`_.${isName}(${inspect(options)})`, function(){
            const matcher = _[isName](options);
            it('should throw a nice error when it fails', function(){
              expect(matcher).to.be.a('function');
              expect(matcher.toString()).to.equal(`${isName}()`);
              expect(() => {
                expect(fales[0]).to.matchPattern(matcher);
              }).to.throw(` didn't match target '${isName}()'`);
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

  const notStrings = () => [undefined, null, true, false, [], {}];
  const randomObjects = () => ['', 'hello', 12, Infinity, ...notStrings()];

  testPatternWithoutOptions(
    'JSON',
    ['""', '[]', '{}'],
    ['', 'hello', ...notStrings()],
  );

  testPatternWithoutOptions(
    'ISOdateString',
    ['2020-12-04T21:18:55.821Z', (new Date).toISOString()],
    [...randomObjects()],
  );

  testPatternWithoutOptions(
    'JWT',
    [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    ],
    ['', ...randomObjects()],
  );

  testPatternWithoutOptions(
    'DID',
    [
      'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
    ],
    ['', 'jlinc:did', 'did:', ...randomObjects()],
  );

  testPatternWithOptions(
    'jsonStringMatching',
    [
      [
        {name: _.isString},
        [toJSON({name: 'Steve'})],
        [toJSON({color: 'red'})],
      ],
      [
        _.isString,
        ['""', '"hello"'],
        ['nope'],
      ],
    ]
  );

  testPatternWithOptions(
    'includedIn',
    [
      [
        [1, 2],
        [1, 2],
        ['please pick me', 5, 11, 22, ...randomObjects(), ...notStrings()]
      ],
      [
        new Set([1, 2]),
        [1, 2],
        ['please pick me', 5, 11, 22, ...randomObjects(), ...notStrings()]
      ]
    ]
  );

  // by hand because time is hard
  it('dateLessThanXAgo', function(){
    const isDateLessThan1000Ago = _.isDateLessThanXAgo(1000);
    expect(isDateLessThan1000Ago).to.be.a('function');
    expect(isDateLessThan1000Ago+'').to.be.equal('isDateLessThanXAgo()');
    expect(isDateLessThan1000Ago()).to.be.false;
    expect(isDateLessThan1000Ago('yestuday')).to.be.false;
    expect(isDateLessThan1000Ago(new Date)).to.be.true;
    expect(isDateLessThan1000Ago(new Date(Date.now() - 2000))).to.be.false;
  });

  // by hand because time is hard
  it('recentDate', function(){
    expect(_.isRecentDate).to.be.a('function');
    expect(_.isRecentDate+'').to.be.equal('isRecentDate()');
    expect(_.isRecentDate()).to.be.false;
    expect(_.isRecentDate('yestuday')).to.be.false;
    expect(_.isRecentDate(new Date)).to.be.true;
    expect(_.isRecentDate(new Date(Date.now() - 2000))).to.be.false;
  });

});

