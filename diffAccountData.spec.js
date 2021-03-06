'use strict';

const diffAccountData = require('./diffAccountData');
const normalizeAccountData = require('./normalizeAccountData');

describe('diffAccountData', function(){
  context('when given matching objects', function(){
    it('should return undefined', function(){
      expect(
        diffAccountData(
          {},
          {},
        )
      ).to.be.undefined;

      expect(
        diffAccountData(
          normalizeAccountData({}),
          normalizeAccountData({}),
        )
      ).to.be.undefined;

      expect(
        diffAccountData(
          normalizeAccountData({}),
          {},
        )
      ).to.be.undefined;
    });
  });
  context('when given differing objects', function(){
    it('should return an account data object with only those differences', function(){
      expect(
        diffAccountData(
          normalizeAccountData({}),
          {
            shared_personal_data: {
              email: false,
              firstname: true,
            },
            personal_data: {
              email: '',
              firstname: 'Alice',
            },
            consents: {
              'Brand Marketing': false,
              'Product Marketing': true,
            },
            communication_channels: {
              email_media: { enabled: false },
              fax_media: { enabled: true },
            },
          },
        )
      ).to.deep.equal({
        shared_personal_data: {
          firstname: true,
        },
        personal_data: {
          firstname: 'Alice',
        },
        consents: {
          'Product Marketing': true,
        },
        communication_channels: {
          fax_media: { enabled: true },
        },
      });
    });
  });

  context('when given custom personal data key', function(){
    it('should work with those keys', function(){
      expect(
        diffAccountData(
          {
            badKey: 42,
            shared_personal_data: {
              anotherBadKey: false,
              "_Shoe Size": false,
              "_Favorite Color": false,
            },
            personal_data: {
              "_Favorite Color": 'Purple',
              email: 'alice@example.com',
              "_Car Model": 'Ford',
            },
          },
          {
            anotherBadKey: 55,
            shared_personal_data: {
              "_Favorite Color": true,
              "_Car Model": false,
            },
            personal_data: {
              "_Favorite Color": 'Brown',
              email: 'alice@example.com',
              "_Car Model": 'Ford',
            },
          },
        )
      ).to.deep.equal({
        shared_personal_data: {
          "_Favorite Color": true,
          "_Car Model": false,
        },
        personal_data: {
          "_Favorite Color": 'Brown',
        },
      });

      expect(
        diffAccountData(
          {
            badKey: 42,
            shared_personal_data: {
              notForKeeps: 'xx',
              firstname: false,
            },
          },
        )
      ).to.be.undefined;

      expect(
        diffAccountData(
          undefined,
          {
            badKey: 42,
            shared_personal_data: {
              notForKeeps: 'xx',
              firstname: false,
              "_Favorite Color": true,
            },
            personal_data: {
              "_Favorite Color": 'organge',
            },
          },
        )
      ).to.deep.equal({
        shared_personal_data: {
          firstname: false,
          "_Favorite Color": true,
        },
        personal_data: {
          "_Favorite Color": 'organge',
        },
      });
    });
  });

});
