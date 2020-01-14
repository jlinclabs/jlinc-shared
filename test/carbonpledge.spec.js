'use strict';

const {
  PLEDGE_TYPES,
  PLEDGE_YEARS,
  isMoreAggressivePledge,
} = require('../carbonpledge');

describe('carbonpledge', function() {
  describe('isMoreAggressivePledge', function() {
    it('should ensure new pledge is more agressive than the existing pledge', function(){
      expect(isMoreAggressivePledge()).to.be.true;
      expect(isMoreAggressivePledge(undefined, {})).to.be.true;

      const permutations = [];
      PLEDGE_TYPES.forEach(pledgeType => {
        [...PLEDGE_YEARS].reverse().forEach(pledgeYear => {
          permutations.push({ pledgeType, pledgeYear });
        });
      });
      permutations.forEach((left, leftIndex) => {
        permutations.forEach((right, rightIndex) => {
          expect(
            isMoreAggressivePledge(left, right)
          ).to.be[ leftIndex < rightIndex ? 'true' : 'false'];
        });
      });
    });
  });
});
