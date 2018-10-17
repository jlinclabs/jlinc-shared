'use strict';

const deepfreeze = require('deep-freeze-node');
const DEFAULT_ACCOUNT_DATA = require('../default_account_data');
const normalizeAccountData = require('../normalizeAccountData');

const NORMALIZED_EMPTY_ACCOUNT_DATA = deepfreeze({
  shared_personal_data: {
    email: false,
    firstname: false,
    lastname: false,
    salutation: false,
    title: false,
    birthdate: false,
    gender: false,
    mailingstreet: false,
    mailingcity: false,
    mailingstate: false,
    mailingpostalcode: false,
    mailingcountry: false,
    homephone: false,
    mobilephone: false,
    faxnumber: false,
    businessname: false,
    businessindustry: false,
    businessstreet: false,
    businesscity: false,
    businesscountry: false,
    businesspostalcode: false,
    businessphone: false,
  },
  personal_data: {
    email: null,
    firstname: null,
    lastname: null,
    salutation: null,
    title: null,
    birthdate: null,
    gender: null,
    mailingstreet: null,
    mailingcity: null,
    mailingstate: null,
    mailingpostalcode: null,
    mailingcountry: null,
    homephone: null,
    mobilephone: null,
    faxnumber: null,
    businessname: null,
    businessindustry: null,
    businessstreet: null,
    businesscity: null,
    businesscountry: null,
    businesspostalcode: null,
    businessphone: null,
  },
  consents: {
    'Brand Marketing': false,
    'Product Marketing': false,
    'New Product Marketing': false,
    'Specific Product Marketing': false,
    'Discount Offers': false,
    'Partner Offers': false,
    'Customer Research': false,
    'Newsletter': false,
    'Membership': false,
    'Volunteering': false,
    'Fundraising': false,
    'Sharing Data within Group': false,
    'Sharing Data with Partners': false,
    'Automated Decision Making': false,
    'Location Tracking': false,
    'Online Tracking': false,
    'Cross-Border Transfers': false,
  },
  communication_channels: {
    email_media: { enabled: false },
    fax_media: { enabled: false },
    postal_mail_media: { enabled: false },
    sms_media: { enabled: false },
    social_media: { enabled: false },
    voice_media: { enabled: false },
  },
});

describe('normalizeAccountData', function(){
  it('should make any implicit values, explicit', function(){
    expect( normalizeAccountData({}) ).to.deep.equal(NORMALIZED_EMPTY_ACCOUNT_DATA);
  });

  context('(DEFAULT_ACCOUNT_DATA)', function(){
    it('should return a deep clone of DEFAULT_ACCOUNT_DATA', function(){
      expect(normalizeAccountData(DEFAULT_ACCOUNT_DATA)).to.deep.equal(DEFAULT_ACCOUNT_DATA);
    });
  });

  context('when given some invalid keys', function(){
    it('should strip out those keys', function(){
      expect(
        normalizeAccountData({
          this_should_be_ignored: 'also',
          shared_personal_data: {
            IGNORED_KEY: 'this is stripped and ignored',
            birthdate: true,
          },
          personal_data: {
            email: 'alice@example.com',
            __notIncluded: ':D',
          },
          consents: {
            anotherIgnoredKey: 'not to be included',
            'Brand Marketing': true,
          },
          communication_channels: {
            ignoredComChan: {},
            email_media: { enabled: true },
          },
        })
      ).to.deep.equal({
        shared_personal_data: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.shared_personal_data,
          birthdate: true,
        },
        personal_data: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.personal_data,
          email: 'alice@example.com',
        },
        consents: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.consents,
          'Brand Marketing': true,
        },
        communication_channels: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.communication_channels,
          email_media: { enabled: true },
        },

      });
    });
  });
});
