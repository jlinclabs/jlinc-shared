'use strict';

const ACCOUNT_DATA_SHAPE = require('../ACCOUNT_DATA_SHAPE');

describe('ACCOUNT_DATA_SHAPE', function() {
  it('should be this', function(){
    expect(ACCOUNT_DATA_SHAPE).to.be.instanceOf(Map);
    expect(Array.from(ACCOUNT_DATA_SHAPE.entries())).to.deep.equal([
      [
        'shared_personal_data',
        [
          'email',
          'firstname',
          'lastname',
          'salutation',
          'birthdate',
          'gender',
          'mailingstreet',
          'mailingcity',
          'mailingstate',
          'mailingpostalcode',
          'mailingcountry',
          'homephone',
          'mobilephone',
          'faxnumber',
          'twitter',
          'linkedin',
          'google',
          'instagram',
          'facebook',
          'businessname',
          'businessindustry',
          'title',
          'businessstreet',
          'businesscity',
          'businesscountry',
          'businesspostalcode',
          'businessphone',
        ]
      ],
      [
        'personal_data',
        [
          'email',
          'firstname',
          'lastname',
          'salutation',
          'birthdate',
          'gender',
          'mailingstreet',
          'mailingcity',
          'mailingstate',
          'mailingpostalcode',
          'mailingcountry',
          'homephone',
          'mobilephone',
          'faxnumber',
          'twitter',
          'linkedin',
          'google',
          'instagram',
          'facebook',
          'businessname',
          'businessindustry',
          'title',
          'businessstreet',
          'businesscity',
          'businesscountry',
          'businesspostalcode',
          'businessphone',
        ]
      ],
      [
        'consents',
        [
          'Brand Marketing',
          'Product Marketing',
          'New Product Marketing',
          'Specific Product Marketing',
          'Discount Offers',
          'Partner Offers',
          'Customer Research',
          'Newsletter',
          'Membership',
          'Volunteering',
          'Fundraising',
          'Sharing Data within Group',
          'Sharing Data with Partners',
          'Automated Decision Making',
          'Location Tracking',
          'Online Tracking',
          'Cross-Border Transfers',
        ]
      ],
      [
        'communication_channels',
        [
          'email_media',
          'fax_media',
          'postal_mail_media',
          'sms_media',
          'voice_media',
          'telegram',
          'linkedin',
          'signal',
          'twitter',
          'google',
          'whatsapp',
          'instagram',
          'facebook',
        ]
      ],
    ]);
  });
});
