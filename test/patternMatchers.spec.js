'use strict';

const { _, definePattern, expect, chai } = require('./matchers');

const UUID_REGEXP = /^[\w-_]+\.[\w-_]+\.[\w-_]*$/;

function testIsUUID(isUUID){
  expect(isUUID).to.be.a('function');
  expect(isUUID()).to.be.false;
  expect(isUUID(undefined)).to.be.false;
  expect(isUUID(null)).to.be.false;
  expect(isUUID(12)).to.be.false;
  expect(isUUID('poop')).to.be.false;
  expect(isUUID('a.b.c')).to.be.true;
  expect(isUUID('xxx..yyy')).to.be.false;
  expect(isUUID('xxx.yyy.')).to.be.true;
  expect(isUUID('xxx.yyy.zzz')).to.be.true;
}

describe('patternMatchers', function(){
  describe('_.matchesPattern', function(){
    context('when given an undefined pattern', function(){
      it('should throw', function(){
        expect(()=>{ _.matchesPattern(); })
          .to.throw(Error, '_.matchesPattern given undefined');
      });
    });
    context('when given a RegExp', function(){
      it('should return an isMatcher function for it', function(){
        const isUUID = _.matchesPattern(UUID_REGEXP);
        testIsUUID(isUUID);

        const isTheStringUndefined = _.matchesPattern(/^undefined$/);
        expect(isTheStringUndefined).to.be.a('function');
        expect(isTheStringUndefined()).to.be.false;
        expect(isTheStringUndefined(undefined)).to.be.false;
        expect(isTheStringUndefined('undefined')).to.be.true;
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
      context('that throws a non assertion error', function(){
        it('it should throw that error', function() {
          const isFire = _.matchesPattern(() => { throw new Error('fire!'); });
          expect(() => { isFire(); }).to.throw(Error, 'fire!');
        });
      });
    });

    context('when given an object', function(){
      it('should treat it as a pattern', function(){
        const isSoda = _.matchesPattern({brand: _.isString});
        expect(isSoda).to.be.a('function');
        expect(isSoda()).to.be.false;
        expect(isSoda(undefined)).to.be.false;
        expect(isSoda({})).to.be.false;
        expect(isSoda({brand: 12})).to.be.false;
        expect(isSoda({brand: 'Coke'})).to.be.true;
      });
    });

  });

  describe('_.isEvery', function(){
    context('when given an undefined pattern', function(){
      it('should throw', function(){
        expect(()=>{ _.isEvery(); })
          .to.throw(Error, '_.isEvery given undefined');
      });
    });
    it('it should generate a matcher for all given patterns', function(){
      const isUUID = _.isEvery(_.isString, UUID_REGEXP);
      testIsUUID(isUUID);
    });
  });

  describe('_.isSome', function(){
    context('when given an undefined pattern', function(){
      it('should throw', function(){
        expect(()=>{ _.isSome(); })
          .to.throw(Error, '_.isSome given undefined');
      });
    });
    it('it should generate a matcher for all given patterns', function(){
      const isStringOrNumber = _.isSome(_.isString, _.isNumber);
      expect(isStringOrNumber).to.be.a('function');
      const trues = [1,10,-1,Infinity];
      const fails = [undefined,null,true,false,[],{}];
      trues.forEach(number => {
        expect(number).to.matchPattern(isStringOrNumber);
        expect(isStringOrNumber(number)).to.be.true;
      });
      fails.forEach(number => {
        expect(number).to.not.matchPattern(isStringOrNumber);
        expect(isStringOrNumber(number)).to.be.false;
      });

      expect(() => {
        expect({
          number: [],
        }).to.matchPattern({
          number: isStringOrNumber
        });
      }).to.throw(`{number: []} didn't match target {number: 'isSome(_.isString, _.isNumber)'}`);
    });

    it('_.isSome', function(){
      expect(_.isSome).to.be.a('function');

      expect(() => { _.isSome(); }).to.throw();
      expect(() => { _.isSome(undefined); }).to.throw();
      expect(() => { _.isSome(_.isString, undefined); }).to.throw();

      expect(_.isSome(_.isString)).to.be.a('function');
      expect(_.isSome(_.isString)('x')).to.be.true;
      expect(_.isSome(_.isString)(1)).to.be.false;
      expect(_.isSome(_.isString, _.isInteger)('x')).to.be.true;
      expect(_.isSome(_.isString, _.isInteger)(1)).to.be.true;
      expect(_.isSome(_.isString, _.isInteger)()).to.be.false;
      expect(_.isSome(_.isString, _.isInteger)([])).to.be.false;

      const example1 = _.isSome(
        _.isNull,
        _.matchesPattern({ type: 'mobile' }),
        _.matchesPattern({ type: 'email' }),
      );
      expect(example1()).to.be.false;
      expect(example1(null)).to.be.true;
      expect(example1({})).to.be.false;
      expect(example1(1)).to.be.false;
      expect(example1('')).to.be.false;
      expect(example1({ type: '' })).to.be.false;
      expect(example1({ type: 'mobile' })).to.be.true;
      expect(example1({ type: 'email' })).to.be.true;
    });
  });

  it('matchesPattern, isEvery and isSome should define toString on returned functions', function(){
    ['matchesPattern', 'isEvery', 'isSome'].forEach(helper => {
      const isString = _[helper](_.isString);
      expect(isString+'').to.equal(`${helper}(_.isString)`);

      const isFrog = _[helper](thing => thing.isSlimey);
      expect(isFrog+'').to.equal(`${helper}(thing => thing.isSlimey)`);

      const isLog = _[helper]({ rings: _.isInteger });
      expect(isLog+'').to.equal(`${helper}({ rings: _.isInteger })`);

      const isABigCow = _[helper]({ isBig: i => i > 10 });
      expect(isABigCow+'').to.equal(`${helper}({ isBig: [Function: isBig] })`);
    });
  });

  describe('definePattern', function(){
    it('.isName', function(){
      [
        ['aCar', 'isCar'],
        ['theStringUndefined', 'isTheStringUndefined'],
        ['anOrganization', 'isOrganization'],
        ['aUser', 'isUser'],
        ['animal', 'isAnimal'],
        ['anAnimal', 'isAnimal'],
        ['aApple', 'isApple'],
        ['aapple', 'isAapple'],
      ].forEach(([aName, isName]) => {
        expect(definePattern.isName(aName)).to.equal(isName);
      });
    });
    describe('when the pattern is a RegExp', function(){
      it('should work like this', function(){
        definePattern('theStringUndefined', /^undefined$/);
        expect(_.isTheStringUndefined).to.be.a('function');
        expect(_.isTheStringUndefined()).to.be.false;
        expect(_.isTheStringUndefined(undefined)).to.be.false;
        expect(_.isTheStringUndefined('undefined')).to.be.true;
        expect().to.not.be.theStringUndefined();
        expect(undefined).to.not.be.theStringUndefined();
        expect('undefined').to.be.theStringUndefined();
        expect(() => {
          expect().to.be.theStringUndefined();
        }).to.throw(
          chai.AssertionError,
          `expected undefined to match pattern theStringUndefined:`
        );

        definePattern('aStringWithLetterZ', /z/);
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
        }).to.throw(
          chai.AssertionError,
          `expected 'peepee' to match pattern aStringWithLetterZ`
        );
        expect(() => {
          expect('zeebra').to.not.be.aStringWithLetterZ();
        }).to.throw(
          chai.AssertionError,
          `expected 'zeebra' to not match pattern aStringWithLetterZ`
        );
      });
    });

    describe('when the pattern is a function', function(){
      describe('that returns a boolean', function(){
        it('should work like this', function(){
          definePattern('aDogName', name =>
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
          definePattern('aMagicCarpet', target => {
            expect(target).to.deep.equal({ magic: 'carpet' });
          });
          expect(_.isMagicCarpet).to.be.a('function');
          expect(expect().to.be.aMagicCarpet).to.be.a('function');
          expect(_.isMagicCarpet()).to.be.false;
          expect(_.isMagicCarpet({})).to.be.false;
          expect(_.isMagicCarpet({magic: 'carpet'})).to.be.true;
        });
      });
      context('that throws a non-assertion error', function(){
        it('should throw that error', function(){
          definePattern('aShoeFarm', () => { throw new Error('fire!'); });
          expect(() => { _.isShoeFarm(); }).to.throw(Error, 'fire!');
          expect(() => { expect().to.be.aShoeFarm(); }).to.throw(Error, 'fire!');
        });
      });
    });

    describe('when the pattern is a function with options', function(){
      it('should work like this', function(){
        definePattern('aMagicShoe', (shoe, schoolOfMagic) => {
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
          `expected {} to match pattern aMagicShoe: AssertionError: {schoolOfMagic: undefined} didn't match target {schoolOfMagic: 'this is wrong'}`
        );
        expect(() => {
          expect({ schoolOfMagic: 'magic is a lie' }).to.be.aMagicShoe('this is wrong');
        }).to.throw(chai.AssertionError, /{schoolOfMagic: 'magic is a lie'} didn't match target {schoolOfMagic: 'this is wrong'}/);
        expect(() => {
          expect({ schoolOfMagic: 'i love magic', laces: 'yes' }).to.not.be.aMagicShoe('i love magic');
        }).to.throw(chai.AssertionError, `expected { Object (schoolOfMagic, laces) } to not match pattern aMagicShoe`);
      });
    });

    it('complex patterns should be composable', function() {
      definePattern('aHand', { fingers: _.isNumber });
      definePattern('aFoot', { toes: _.isNumber });
      definePattern('aBody', {
        hand: _.isHand,
        foot: _.isFoot,
        '...': 0,
      });
      definePattern('anAlienBody', body => {
        expect(body).to.be.aBody();
        expect(body.eyes).to.equal('almond');
        expect(body.isHuman).to.not.be.true;
      });
      definePattern('anAlienBodyNamed', (body, name) => {
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
        `expected { Object (name, hand, ...) } to not match pattern anAlienBodyNamed`
      );

      expect(
        () => {
          expect({
            tea: 'in a pot',
          }).to.matchPattern({
            tea: _.isAlienBodyNamed('Tea')
          });
        }
      ).to.throw(`{tea: 'in a pot'} didn't match target {tea: "isAlienBodyNamed('Tea')"}`);
    });

  });

});
