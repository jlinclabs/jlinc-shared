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

    context('with no changes in communication_channels and existing communication_channels', function(){
      expect(mergeAccountData({
        changes: {
          shared_personal_data: { lastname: false },
        },
        accountData: {
          shared_personal_data: {
            email: true,
            gender: true,
            lastname: true,
            birthdate: true,
            faxnumber: true,
            firstname: true,
            homephone: true,
            mailingcity: true,
            mobilephone: true,
            mailingstate: true,
            businessphone: true,
            mailingstreet: true,
            mailingcountry: true,
            mailingpostalcode: true
          },
          personal_data: {
            email: 'foobarski@booyakahsha.io',
            firstname: 'foobarski',
            lastname: 'booyakahsha',
            homephone: '415-555-5555',
            mobilephone: '415-555-5556',
            gender: 'female'
          },
          consents: {
            Membership: false,
            Fundraising: false,
            Volunteering: true
          },
          communication_channels: {
            fax_media: { enabled: false },
            email_media: { enabled: false },
            postal_mail_media: { enabled: false },
          },
        }
      })).to.deep.equal({
        personal_data: {
          email: 'foobarski@booyakahsha.io',
          firstname: 'foobarski',
          lastname: 'booyakahsha',
          homephone: '415-555-5555',
          mobilephone: '415-555-5556',
          gender: 'female'
        },
        communication_channels: {
          email_media: { enabled: false },
          fax_media: { enabled: false },
          postal_mail_media: { enabled: false }
        },
        shared_personal_data: {
          email: true,
          lastname: false,
          firstname: true,
          birthdate: true,
          gender: true,
          mailingcity: true,
          mailingcountry: true,
          mailingpostalcode: true,
          mailingstate: true,
          mailingstreet: true,
          homephone: true,
          mobilephone: true,
          faxnumber: true,
          businessphone: true
        },
        consents: {
          Membership: false,
          Fundraising: false,
          Volunteering: true
        }
      });
    });
  });

});
