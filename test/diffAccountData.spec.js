'use strict';

const deepfreeze = require('deep-freeze-node');

const DEFAULT_ACCOUNT_DATA = require('../default_account_data');
const diffAccountData = require('../diffAccountData');

describe('diffAccountData', function(){
  context('({}, {})', function(){
    it('should return undefined', function(){
      expect(diffAccountData({}, {})).to.be.undefined;
    });
  });

  context('when given invalid key', function(){
    it('should ignore those keys', function(){
      expect(
        diffAccountData(
          {
            badKey: 42,
            shared_personal_data: {
              notForKeeps: 'xx',
            },
          },
          {
            anotherBadKey: 55,
            personal_data: {
              fooBar: 'fb',
              email: 'alice@example.com',
            },
          },
        )
      ).to.deep.equal({
        personal_data: {
          email: 'alice@example.com',
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
            },
          },
        )
      ).to.deep.equal({
        shared_personal_data: {
          firstname: false,
        },
      });
    });
  });

  it('should return the difference between the two given accoundData objects', function(){
    let changes = deepfreeze({
      shared_personal_data: {
        email: false,
        firstname: true,
      },
      personal_data: {
        email: null,
        firstname: 'changed-firstname',
        lastname: '',
      },
      consents: {
        'Brand Marketing': false,
        'Product Marketing': true,
      },
      communication_channels: {
        email_media: { enabled: true },
        fax_media: { enabled: false },
      }
    });

    expect(diffAccountData({}, changes)).to.deep.equal(changes);
    expect(diffAccountData(DEFAULT_ACCOUNT_DATA, changes)).to.deep.equal({
      shared_personal_data: {
        email: false,
      },
      personal_data: {
        firstname: 'changed-firstname',
        lastname: '',
      },
      consents: {
        'Product Marketing': true,
      },
      communication_channels: {
        email_media: { enabled: true },
      }
    });
  });

});