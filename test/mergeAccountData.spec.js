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
              '_Favorite Color': true,
            },
            personal_data: {
              email: 'email',
              firstname: '',
              '_Favorite Color': 'Purple',
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
              '_Shoe Size': true,
              '_Favorite Color': false,
            },
            personal_data: {
              email: 'email2',
              firstname: 'firstname2',
              lastname: 'lastname2',
              salutation: '',
              '_Shoe Size': '12',
              '_Favorite Color': 'Orange',
            },
            consents: {
              'Brand Marketing': false,
              'Product Marketing': null,
            },
            communication_channels: {
              email_media: { enabled: false },
              fax_media: null,
              twitter: { enabled: false },
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
          '_Favorite Color': false,
          '_Shoe Size': true,
        },
        personal_data: {
          email: 'email2',
          firstname: 'firstname2',
          lastname: 'lastname2',
          salutation: '',
          '_Favorite Color': 'Orange',
          '_Shoe Size': '12',
        },
        consents: {
          'Brand Marketing': false,
        },
        communication_channels: {
          email_media: { enabled: false },
          fax_media: { enabled: false },
          twitter: { enabled: false },
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
