'use strict';

const { _, expect, definePattern } = require('./matchers');
const { inspect } = require('./patternMatchers');
require('./patterns');

const toJSON = JSON.stringify;

describe('patterns', function(){

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

  const notStrings = () => [undefined, null, true, false, [], {}];
  const randomObjects = () => ['', 'hello', 12, Infinity, ...notStrings()];

  testPatternWithoutOptions(
    'JSON',
    ['""', '[]', '{}'],
    ['', 'hello', ...notStrings()],
  );

  testPatternWithoutOptions(
    'anISOdateString',
    ['2020-12-04T21:18:55.821Z', (new Date).toISOString()],
    [...randomObjects()],
  );

  testPatternWithoutOptions(
    'aJWT',
    [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    ],
    ['', ...randomObjects()],
  );

  testPatternWithoutOptions(
    'aDID',
    [
      'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
    ],
    ['', 'jlinc:did', 'did:', ...randomObjects()],
  );

  testPatternWithOptions(
    'aJsonStringMatching',
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
  it('aDateLessThanXAgo', function(){
    const isDateLessThan1000Ago = _.isDateLessThanXAgo(1000);
    expect(isDateLessThan1000Ago).to.be.a('function');
    expect(isDateLessThan1000Ago+'').to.be.equal('isDateLessThanXAgo(1000)');
    expect(isDateLessThan1000Ago()).to.be.false;
    expect(isDateLessThan1000Ago('yestuday')).to.be.false;
    expect(isDateLessThan1000Ago(new Date)).to.be.true;
    expect(isDateLessThan1000Ago(new Date(Date.now() - 2000))).to.be.false;
    expect(new Date(Date.now() - 1000)).to.be.aDateLessThanXAgo(2000);
    expect(() => {
      expect(new Date(Date.now() - 2000)).to.be.aDateLessThanXAgo(1000);
    }).to.throw('to match pattern aDateLessThanXAgo');
  });

  // by hand because time is hard
  it('aRecentDate', function(){
    expect(_.isRecentDate).to.be.a('function');
    expect(_.isRecentDate+'').to.be.equal('isRecentDate()');
    expect(_.isRecentDate()).to.be.false;
    expect(_.isRecentDate('yestuday')).to.be.false;
    expect(_.isRecentDate(new Date)).to.be.true;
    expect(_.isRecentDate(new Date(Date.now() - 2000))).to.be.false;
    expect(new Date).to.be.aRecentDate();
    expect(new Date(Date.now() - 2000)).to.not.be.aRecentDate();
  });

  testPatternWithoutOptions(
    'trueOrUndefined',
    [ , undefined, true],
    [null, false],
  );

  testPatternWithoutOptions(
    'anOrganizationApikey',
    ['abc', 'planetwork', 'thisisexactlythirtycharacterss'],
    [
      12, '', 'a', 'thisislongerthanthirtycharacters',
      'no_underscores', 'also-no-dashes',
    ],
  );

});

