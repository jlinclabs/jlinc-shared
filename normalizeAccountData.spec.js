'use strict';

const deepfreeze = require('deep-freeze-node');
const normalizeAccountData = require('./normalizeAccountData');

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
    twitter: false,
    linkedin: false,
    google: false,
    instagram: false,
    facebook: false,
    businessname: false,
    businessindustry: false,
    businessstreet: false,
    businesscity: false,
    businesscountry: false,
    businesspostalcode: false,
    businessphone: false,
  },
  personal_data: {
    email: '',
    firstname: '',
    lastname: '',
    salutation: '',
    title: '',
    birthdate: '',
    gender: '',
    mailingstreet: '',
    mailingcity: '',
    mailingstate: '',
    mailingpostalcode: '',
    mailingcountry: '',
    homephone: '',
    mobilephone: '',
    faxnumber: '',
    twitter: '',
    linkedin: '',
    google: '',
    instagram: '',
    facebook: '',
    businessname: '',
    businessindustry: '',
    businessstreet: '',
    businesscity: '',
    businesscountry: '',
    businesspostalcode: '',
    businessphone: '',
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
    'Ok to sell my data': false,
  },
  communication_channels: {
    email_media: { enabled: false },
    fax_media: { enabled: false },
    postal_mail_media: { enabled: false },
    sms_media: { enabled: false },
    voice_media: { enabled: false },
    linkedin: { enabled: false },
    telegram: { enabled: false },
    twitter: { enabled: false },
    signal: { enabled: false },
    google: { enabled: false },
    whatsapp: { enabled: false },
    instagram: { enabled: false },
    facebook: { enabled: false },
  },
});

describe('normalizeAccountData', function(){
  it('should make any implicit values, explicit', function(){
    expect( normalizeAccountData({}) ).to.deep.equal(NORMALIZED_EMPTY_ACCOUNT_DATA);
    expect( normalizeAccountData(NORMALIZED_EMPTY_ACCOUNT_DATA) ).to.deep.equal(NORMALIZED_EMPTY_ACCOUNT_DATA);
    expect(
      normalizeAccountData({
        shared_personal_data: {
          birthdate: true,
          '_Favorite Color': false,
        },
        personal_data: {
          email: 'alice@example.com',
          '_Favorite Color': 'Purple',
        },
        consents: {
          'Brand Marketing': true,
        },
        communication_channels: {
          email_media: { enabled: true },
        },
      })
    ).to.deep.equal({
      shared_personal_data: {
        ...NORMALIZED_EMPTY_ACCOUNT_DATA.shared_personal_data,
        birthdate: true,
        '_Favorite Color': false,
      },
      personal_data: {
        ...NORMALIZED_EMPTY_ACCOUNT_DATA.personal_data,
        email: 'alice@example.com',
        '_Favorite Color': 'Purple',
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

  context('when given some invalid keys', function(){
    it('should strip out those keys', function(){
      expect(
        normalizeAccountData({
          this_should_be_ignored: 'also',
          shared_personal_data: {
            IGNORED_KEY: 'this is stripped and ignored',
            birthdate: true,
            '_Favorite Color': false,
          },
          personal_data: {
            email: 'alice@example.com',
            '_Favorite Color': 'Purple',
            notIncluded: ':D',
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
          '_Favorite Color': false,
        },
        personal_data: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.personal_data,
          email: 'alice@example.com',
          '_Favorite Color': 'Purple',
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

  context('when given a personal data field whose value is an empty string and the corresponding shared field is shared', function() {
    it('should unshare the shared personal data field', async function(){
      expect(
        normalizeAccountData({
          shared_personal_data: {
            email: true,
          },
          personal_data: {
            email: '',
          },
        })
      ).to.deep.equal({
        shared_personal_data: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.shared_personal_data,
        },
        personal_data: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.personal_data,
        },
        consents: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.consents,
        },
        communication_channels: {
          ...NORMALIZED_EMPTY_ACCOUNT_DATA.communication_channels,
        },
      });
    });
  });
});
