'use strict';

const mergeAccountData = require('../mergeAccountData');
const DEFAULT_SHARED_PERSONAL_DATA = require('../default_shared_personal_data');

describe('mergeAccountData', function(){

  context('when given no changes', function() {
    it('should throw an error', function(){
      expect(() => mergeAccountData({})).to.throw('changes required');
    });
  });

  context('when given no accountData', function() {
    it('should throw an error', function(){
      expect(() => mergeAccountData({
        changes: {}
      })).to.throw('accountData required');
    });
  });

  context('when given empty changes and accountData', function() {
    it('should return default account data', function(){
      expect(mergeAccountData({
        changes: {},
        accountData: {},
      })).to.deep.equal({
        personal_data: {},
        communication_channels: {},
        consents: {},
        shared_personal_data: DEFAULT_SHARED_PERSONAL_DATA,
      });
    });
  });

  context('with changes and accountData', function() {
    it('should return a merge of account data and changes', function(){
      expect(mergeAccountData({
        changes: {
          personal_data: {
            email: 'arealemail@facebook.com',
            firstname: 'Smellvan',
          },
          communication_channels: {
            sms_media: { enabled: false },
            voice_media: { enabled: true }
          },
          shared_personal_data: {
            firstname: true,
            lastname: false,
            mailingcity: false,
          },
          consents: {
            'Sharing Data with Partners': true,
            'Newsletter': false,
          }
        },
        accountData: {
          personal_data: { email: 'notanemail@notfacebook.com' },
          communication_channels: {
            sms_media: { enabled: true },
            postal_mail_media:{ enabled: true },
          },
          shared_personal_data: {
            firstname: false,
            lastname: true,
          },
          consents: {
            'Newsletter': true,
            'Membership': true,
          }
        },
      })).to.deep.equal({
        personal_data: {
          email: 'arealemail@facebook.com',
          firstname: 'Smellvan',
        },
        communication_channels: {
          postal_mail_media:{ enabled: true },
          sms_media: { enabled: false },
          voice_media: { enabled: true },
        },
        consents: {
          'Sharing Data with Partners': true,
          'Newsletter': false,
          'Membership': true,
        },
        shared_personal_data: Object.assign(
          {},
          DEFAULT_SHARED_PERSONAL_DATA,
          {
            firstname: true,
            lastname: false,
            mailingcity: false,
          }
        ),
      });
    });
  });

});
