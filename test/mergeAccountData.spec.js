'use strict';

const mergeAccountData = require('../mergeAccountData');

describe('mergeAccountData', function(){

  context('when merging two empty objects', function(){
    it('should return and empty object', function(){
      expect(mergeAccountData({}, {})).to.deep.equal({});
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

  context('when given valid keys', function(){
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
              firstname: '',
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
              salutation: '',
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
          salutation: false,
        },
        personal_data: {
          email: 'email2',
          firstname: 'firstname2',
          lastname: 'lastname2',
          salutation: '',
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

    context('when given new account data that has an enabled shared personal data field but no corresponding personal data value', function(){
      expect(
        mergeAccountData(
          {
            shared_personal_data: {
              firstname: true,
            },
            personal_data: {
              firstname: 'firstname',
            },
          },
          {
            shared_personal_data: {
              firstname: true,
            },
            personal_data: {
              firstname: '',
            },
          },
        )
      ).to.deep.equal({
        shared_personal_data: {
          firstname: false,
        },
        personal_data: {
          firstname: '',
        }
      });
      expect(
        mergeAccountData(
          {},
          {
            shared_personal_data: {
              firstname: true,
            },
            personal_data: {
              firstname: '',
            },
          },
        )
      ).to.deep.equal({
        shared_personal_data: {
          firstname: false,
        },
        personal_data: {
          firstname: '',
        }
      });
      expect(
        mergeAccountData(
          {
            shared_personal_data: {
              firstname: true,
            },
            personal_data: {
              firstname: '',
            },
          },
          {},
        )
      ).to.deep.equal({
        shared_personal_data: {
          firstname: false,
        },
        personal_data: {
          firstname: '',
        }
      });
      expect(
        mergeAccountData(
          {
            personal_data: {
              firstname: 'firstname',
            },
          },
          {
            personal_data: {
              firstname: '',
            },
          },
        )
      ).to.deep.equal({
        shared_personal_data: {
          firstname: false,
        },
        personal_data: {
          firstname: '',
        }
      });
    });
  });
});
