'use strict';

const { _, definePattern, expect, chai } = require('./matchers');

const UUID_REGEXP = /^[\w-_]+\.[\w-_]+\.[\w-_]*$/;

function testIsUUID(isUUID){
  expect(isUUID).to.be.a('function');
  expect(isUUID()).to.be.false;
  expect(isUUID(12)).to.be.false;
  expect(isUUID('poop')).to.be.false;
  expect(isUUID('a.b.c')).to.be.true;
  expect(isUUID('xxx..yyy')).to.be.false;
  expect(isUUID('xxx.yyy.')).to.be.true;
  expect(isUUID('xxx.yyy.zzz')).to.be.true;
}

describe('patternMatchers', function(){
  describe('_.matchesPattern', function(){
    context('when given a RegExp', function(){
      it('should return an isMatcher function for it', function(){
        const isUUID = _.matchesPattern(UUID_REGEXP);
        testIsUUID(isUUID);
      });
    });

    context('when given a function', function(){
      context('that returns a boolean', function(){
        it('it should match based on the returned boolean', function(){
          const isUUID = _.matchesPattern(target =>
            _.isString(target) && UUID_REGEXP.test(target)
          );
          testIsUUID(isUUID);
        });
      });
      context('that uses expect', function(){
        it('it should normalize functions that do not return a boolean', function(){
          const isUUID = _.matchesPattern(target => {
            expect(target).to.be.a('string');
            expect(target).to.match(UUID_REGEXP);
          });
          testIsUUID(isUUID);
        });
      });
    });
  });

  describe('_.isEvery', function(){
    it('it should generate a matcher for all given patterns', function(){
      const isUUID = _.isEvery(_.isString, UUID_REGEXP);
      testIsUUID(isUUID);
    });
  });

  describe('_.isSome', function(){
    it('it should generate a matcher for all given patterns', function(){
      const isStringOrNumber = _.isSome(_.isString, _.isNumber);
      expect(isStringOrNumber).to.be.a('function');
      const trues = [1,10,-1,Infinity];
      const fales = [,undefined,null,true,false,[],{}];
      trues.forEach(number => {
        expect(number).to.matchPattern(isStringOrNumber);
        expect(isStringOrNumber(number)).to.be.true;
      });
      fales.forEach(number => {
        expect(number).to.not.matchPattern(isStringOrNumber);
        expect(isStringOrNumber(number)).to.be.false;
      });
    });
  });

  describe('definePattern', function(){
    describe('when the pattern is a RegExp', function(){
      it('should work like this', function(){
        definePattern('stringWithLetterZ', /z/);
        expect(_.isStringWithLetterZ).to.be.a('function');
        expect(_.isStringWithLetterZ({})).to.be.false;
        expect(_.isStringWithLetterZ('l')).to.be.false;
        expect(_.isStringWithLetterZ('z')).to.be.true;

        expect(expect().to.be.aStringWithLetterZ).to.be.a('function');
        expect({}).to.not.be.aStringWithLetterZ();
        expect('bb').to.not.be.aStringWithLetterZ();
        expect('zp').to.be.aStringWithLetterZ();
        expect(() => {
          expect('peepee').to.be.aStringWithLetterZ();
        }).to.throw(chai.AssertionError, `'peepee' didn't match target /z/`);
        expect(() => {
          expect('zeebra').to.not.be.aStringWithLetterZ();
        }).to.throw(chai.AssertionError, `expected 'zeebra' to not match pattern stringWithLetterZ`);
      });
    });

    describe('when the pattern is a function', function(){
      describe('that returns a boolean', function(){
        it('should work like this', function(){
          definePattern('dogName', name =>
            _.isString(name) && !!name.match(/^\w+$/)
          );
          expect(_.isDogName).to.be.a('function');
          expect(_.isDogName()).to.be.false;
          expect(_.isDogName('')).to.be.false;
          expect(_.isDogName('a')).to.be.true;
          expect(expect().to.be.aDogName).to.be.a('function');
          expect().to.not.be.aDogName();
          expect('').to.not.be.aDogName();
          expect('x').to.be.aDogName();
        });
      });
      describe('that uses expect', function(){
        it('should work like this', function(){
          definePattern('magicCarpet', target => {
            expect(target).to.deep.equal({ magic: 'carpet' });
          });
          expect(_.isMagicCarpet).to.be.a('function');
          expect(expect().to.be.aMagicCarpet).to.be.a('function');
          expect(_.isMagicCarpet()).to.be.false;
          expect(_.isMagicCarpet({})).to.be.false;
          expect(_.isMagicCarpet({magic: 'carpet'})).to.be.true;
        });
      });
    });

    describe('when the pattern is a function with options', function(){
      it('should work like this', function(){
        definePattern('magicShoe', (shoe, schoolOfMagic) => {
          expect(shoe).to.matchPattern({
            schoolOfMagic,
            laces: _.isString,
          });
        });

        expect(_.isMagicShoe).to.be.a('function');
        expect(_.isMagicShoe('dark')).to.be.a('function');
        expect(_.isMagicShoe('dark')({})).to.be.false;
        expect(
          _.isMagicShoe('dark')({
            schoolOfMagic: 'dark',
            laces: 'long',
          })
        ).to.be.true;

        expect(expect().to.be.aMagicShoe).to.be.a('function');
        expect(() => {
          expect({ schoolOfMagic: 'i love magic', laces: 'yes' }).to.be.aMagicShoe('i love magic');
        }).to.not.throw();
        expect(() => {
          expect({}).to.be.aMagicShoe('this is wrong');
        }).to.throw(
          chai.AssertionError,
          `expected {} to match pattern magicShoe: AssertionError: {schoolOfMagic: undefined} didn't match target {schoolOfMagic: 'this is wrong'}`
        );
        expect(() => {
          expect({ schoolOfMagic: 'magic is a lie' }).to.be.aMagicShoe('this is wrong');
        }).to.throw(chai.AssertionError, /{schoolOfMagic: 'magic is a lie'} didn't match target {schoolOfMagic: 'this is wrong'}/);
        expect(() => {
          expect({ schoolOfMagic: 'i love magic', laces: 'yes' }).to.not.be.aMagicShoe('i love magic');
        }).to.throw(chai.AssertionError, `expected { Object (schoolOfMagic, laces) } to not match pattern magicShoe`);
      });
    });

    it('complex patterns should be composable', function() {
      definePattern('hand', { fingers: _.isNumber });
      definePattern('foot', { toes: _.isNumber });
      definePattern('body', {
        hand: _.isHand,
        foot: _.isFoot,
        '...': 0,
      });
      definePattern('alienBody', body => {
        expect(body).to.be.aBody();
        expect(body.eyes).to.equal('almond');
        expect(body.isHuman).to.not.be.true;
      });
      definePattern('alienBodyNamed', (body, name) => {
        expect(body).to.be.anAlienBody();
        expect(body.name).to.equal(name);
        expect(body.nameless).to.not.be.false;
      });

      const Bill = {
        name: 'Bill',
        hand: { fingers: 2 },
        foot: { toes: 99 },
        eyes: 'almond',
      };
      expect(Bill).to.be.anAlienBodyNamed('Bill');
      expect(Bill).to.not.be.anAlienBodyNamed('Steve');

      expect(() => {
        expect(Bill).to.not.be.anAlienBodyNamed('Bill');
      }).to.throw(
        chai.AssertionError,
        `expected { Object (name, hand, ...) } to not match pattern alienBodyNamed`
      );
    });

  });
});
