'use strict';

const DEFAULT_ACCOUNT_DATA = require('../default_account_data');
const mergeAccountData = require('../mergeAccountData');

describe('mergeAccountData', function(){

  context('({}, {})', function(){
    it('should return and empty object', function(){
      expect(mergeAccountData({}, {})).to.deep.equal({});
    });
  });

  context('(DEFAULT_ACCOUNT_DATA, {})', function(){
    it('should return a deep copy of DEFAULT_ACCOUNT_DATA', function(){
      expect(mergeAccountData(DEFAULT_ACCOUNT_DATA, {})).to.deep.equal(DEFAULT_ACCOUNT_DATA);
      expect(mergeAccountData(DEFAULT_ACCOUNT_DATA, {})).to.not.equal(DEFAULT_ACCOUNT_DATA);
    });
  });

  context('(DEFAULT_ACCOUNT_DATA, undefined)', function(){
    it('should return a deep copy of DEFAULT_ACCOUNT_DATA', function(){
      expect(mergeAccountData(DEFAULT_ACCOUNT_DATA, undefined)).to.deep.equal(DEFAULT_ACCOUNT_DATA);
      expect(mergeAccountData(DEFAULT_ACCOUNT_DATA, undefined)).to.not.equal(DEFAULT_ACCOUNT_DATA);
    });
  });

  context('({}, DEFAULT_ACCOUNT_DATA)', function(){
    it('should return a deep copy of DEFAULT_ACCOUNT_DATA', function(){
      expect(mergeAccountData({}, DEFAULT_ACCOUNT_DATA)).to.deep.equal(DEFAULT_ACCOUNT_DATA);
      expect(mergeAccountData({}, DEFAULT_ACCOUNT_DATA)).to.not.equal(DEFAULT_ACCOUNT_DATA);
    });
  });

  context('(undefined, DEFAULT_ACCOUNT_DATA)', function(){
    it('should return a deep copy of DEFAULT_ACCOUNT_DATA', function(){
      expect(mergeAccountData(undefined, DEFAULT_ACCOUNT_DATA)).to.deep.equal(DEFAULT_ACCOUNT_DATA);
      expect(mergeAccountData(undefined, DEFAULT_ACCOUNT_DATA)).to.not.equal(DEFAULT_ACCOUNT_DATA);
    });
  });

  context('(DEFAULT_ACCOUNT_DATA, DEFAULT_ACCOUNT_DATA)', function(){
    it('should return a deep copy of DEFAULT_ACCOUNT_DATA', function(){
      expect(mergeAccountData(DEFAULT_ACCOUNT_DATA, DEFAULT_ACCOUNT_DATA)).to.deep.equal(DEFAULT_ACCOUNT_DATA);
      expect(mergeAccountData(DEFAULT_ACCOUNT_DATA, DEFAULT_ACCOUNT_DATA)).to.not.equal(DEFAULT_ACCOUNT_DATA);
    });
  });

  context('when given invalid keys', function(){
    it('should ignore those keys', function(){
      expect(
        mergeAccountData(
          {
            badKey: 'here',
            shared_personal_data: {
              NotAGoodOne: 'sobad',
            },
            consents: {
              ignore: 'me',
            },
          },
          {
            otherBadKey: 'over here',
            personal_data: {
              noGood: 'nope',
            },
            communication_channels: {
              forgetMe: 'baby',
            }
          },
        )
      ).to.deep.equal({});
    });
  });

  it('should return a merge of the two given accound datas', function(){
    expect(
      mergeAccountData(
        {
          shared_personal_data: {
            email: true,
            firstname: false,
            salutation: null,
          },
          personal_data: {
            email: 'email',
            firstname: null,
          },
          consents: {
            'Brand Marketing': true,
            'New Product Marketing': null,

          },
          communication_channels: {
            email_media: { enabled: true },
            fax_media: { enabled: false },
            postal_mail_media: { },
            sms_media: null,
          },
        },
        {
          shared_personal_data: {
            email: false,
            firstname: null,
            lastname: true,
          },
          personal_data: {
            email: 'email2',
            firstname: 'firstname2',
            lastname: 'lastname2',
            salutation: null,
          },
          consents: {
            'Brand Marketing': false,
            'Product Marketing': null,
          },
          communication_channels: {
            email_media: { enabled: false },
            fax_media: null,
            social_media: { enabled: true },
            voice_media: {},
          },
        },
      )
    ).to.deep.equal({
      shared_personal_data: {
        email: false,
        firstname: false,
        lastname: true,
      },
      personal_data: {
        email: 'email2',
        firstname: 'firstname2',
        lastname: 'lastname2',
        salutation: null,
      },
      consents: {
        'Brand Marketing': false,
      },
      communication_channels: {
        email_media: { enabled: false },
        fax_media: { enabled: false },
        social_media: { enabled: true },
      },
    });
  });
});
