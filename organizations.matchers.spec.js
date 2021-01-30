'use strict';

const {
  testPatternWithoutOptions,
  notObjects,
  notStrings,
} = require('./test/helpers');
require('./organizations.matchers');

describe('organizations.matchers', function(){

  testPatternWithoutOptions(
    'anOrganizationApikey',
    ['abc', 'work4fun', 'thisisexactlythirtycharacterss'],
    [
      12, '', 'a', 'thisislongerthanthirtycharacters',
      'no_underscores', 'also-no-dashes',
    ],
  );

  testPatternWithoutOptions(
    'organizationRequestedData',
    [
      {},
      {
        email: true,
        firstname: true,
        lastname: true,
        salutation: true,
        _customKey: false,
      },
    ],
    [
      ...notObjects(),
      {email: 'x@x.com'},
      {_Size: 12},
    ],
  );

  testPatternWithoutOptions(
    'anOrganizationApikey',
    [
      'planetwork',
    ],
    [
      '',
      '-_',
      ...notStrings(),
    ],
  );

  testPatternWithoutOptions(
    'anOrganizationPurpose',
    [
      'Personal',
      'Topical',
      'Organizational',
    ],
    [
      '',
      ...notStrings(),
    ],
  );

  testPatternWithoutOptions(
    'anOrganizationType',
    [
      'individual_thought_leader',
      'sole_proprietorship',
      'small_business',
      'ngo',
      'association',
      'academic_entity',
      'faithbased_religious',
      'government',
      'corporation',
    ],
    [
      ...notStrings(),
    ],
  );

  testPatternWithoutOptions(
    'organizationConcents',
    [
      {},
      {'Brand Marketing': {enabled: true}},
      {
        'Brand Marketing': { enabled: false },
        'Product Marketing': { enabled: false },
        'New Product Marketing': { enabled: false },
        'Specific Product Marketing': { enabled: false },
        'Discount Offers': { enabled: false },
        'Partner Offers': { enabled: false },
        'Customer Research': { enabled: false },
        'Newsletter': { enabled: false },
        'Membership': { enabled: false },
        'Volunteering': { enabled: false },
        'Fundraising': { enabled: false },
        'Sharing Data within Group': { enabled: false },
        'Sharing Data with Partners': { enabled: false },
        'Automated Decision Making': { enabled: false },
        'Location Tracking': { enabled: false },
        'Online Tracking': { enabled: false },
        'Cross-Border Transfers': { enabled: false },
        'Ok to sell my data': { enabled: false },
      },
      // {_Special: {enabled: false}},
    ],
    [
      ...notObjects(),
    ],
  );

  testPatternWithoutOptions(
    'organizationRequestedData',
    [
      {},
      {email: true},
      {_Special: true},
    ],
    [
      ...notObjects(),
    ],
  );

  testPatternWithoutOptions(
    'organizationCommunicationChannels',
    [
      {},
      {
        email_media: true,
        fax_media: true,
        postal_mail_media: true,
        sms_media: true,
        voice_media: true,
        telegram: true,
        linkedin: true,
        signal: true,
        twitter: true,
        google: true,
        whatsapp: true,
        instagram: true,
        facebook: true,
      },
    ],
    [
      ...notObjects(),
    ],
  );

  testPatternWithoutOptions(
    'anOrganization',
    [
      {
        did: 'did:jlinc:MV1o6cjP_ySeTmJHZe2fmrBgNmgGLDT1YzvDsYzQi-U',
        apikey: 'datayogi',
        signing_public_key: 'MV1o6cjP_ySeTmJHZe2fmrBgNmgGLDT1YzvDsYzQi-U',
        encrypting_public_key: 'ZvoF4Y_7blHIhBo5J_XTwUTUM04ec91c8fG8GNhBN34',
        consumer_icon: 'http://fake-assets.test:8081/7b1c3d10-04fc-11eb-8ab4-579738423e97.png',
        consumer_banner: 'http://fake-assets.test:8081/7661e950-04fc-11eb-8ab4-579738423e97.png',
        name: 'datayogi',
        legal_name: 'datayogi',
        ein: null,
        dpo_email: 'datayogi@gmail.com',
        domain: null,
        contact_phone: null,
        contact_phone_2: null,
        address: null,
        city: null,
        post_code: '94121',
        country: 'United States',
        consents: {
          Newsletter: { enabled: true },
          'Brand Marketing': { enabled: true }
        },
        communication_channels: { email_media: true },
        requested_data: { email: true, lastname: true, firstname: true },
        consumer_description: '<p>datayogi</p>',
        state: 'CA',
        public: true,
        consumer_marketplace_tags: [],
        display_end_user_did: false,
        purpose: 'Organizational',
        type: 'ngo',
        is_network: false,
        is_private: false,
        is_closed: false,
        closed_memberships: false,
        users_can_request_membership: true,
        tag_line: 'datayogi',
        publicly_listed: false,
        stripe_email: null,
        stripe_name: null,
        stripe_city: null,
        stripe_street: null,
        stripe_state: null,
        stripe_country: null,
        stripe_post_code: null,
        contact_email: null,
        contact_mobile: null,
        business_email: null,
        business_phone: null,
        prefered_contact_channel: null,
        orgs_subscribed_to_order: [],
        short_description: 'a test org',
      }
    ],
    [
      {},
      ...notObjects(),
    ],
  );


  // it('isOrganizationPurpose', function(){
  //   expect(_.isOrganizationPurpose).to.be.a('function')
  //   expect(_.isOrganizationPurpose('ass')).to.be.false
  //   Object.keys(ORGANIZATION_TYPES_BY_PURPOSE).forEach(purpose => {
  //     expect(_.isOrganizationPurpose(purpose)).to.be.true
  //   })
  // })
  // it('organizationCommunicationChannels', function(){
  //   expect({
  //     signal: true,
  //     twitter: true,
  //     telegram: true,
  //     instagram: true,
  //     sms_media: true,
  //     email_media: true,
  //     postal_mail_media: true
  //   }).to.be.organizationCommunicationChannels()

  //   expect(14).to.not.be.organizationCommunicationChannels()
  // })

});

