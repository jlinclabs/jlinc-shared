'use strict';

const mergeAccountDataChanges = require('../mergeAccountDataChanges');

describe('mergeAccountDataChanges', function(){

  context('when given nothing', function() {
    it('should return undefined', function(){
      expect(
        mergeAccountDataChanges({
          // currentAccountData: {},
          // stagedChanges: {},
          // newChanges: {},
        })
      ).to.be.undefined;
    });
  });

  context('when given all empty objects', function() {
    it('should return undefined', function(){
      expect(
        mergeAccountDataChanges({
          currentAccountData: {},
          stagedChanges: {},
          newChanges: {},
        })
      ).to.be.undefined;
    });
  });

  context('when currentAccountData but no stagedChange or newChange', function() {
    it('should return undefined', function(){
      expect(
        mergeAccountDataChanges({
          currentAccountData: {
            shared_personal_data: {
              email: true,
              lastname: true,
            },
            personal_data: {
              firstname: 'Alice',
            },
            consents: {
              'New Product Marketing': true,
            },
            communication_channels: {
              email_media: { enabled: true },
            }
          },
          // stagedChanges: {},
          // newChanges: {},
        })
      ).to.be.undefined;
    });
  });

  context('when currentAccountData, stagedChange but no newChange', function() {
    it('should return a deep copy of the given stagedChanges', function(){
      const getCurrentAccountData = () => (
        {
          shared_personal_data: {
            email: true,
            lastname: true,
          },
          personal_data: {
            firstname: 'Alice',
          },
          consents: {
            'New Product Marketing': true,
          },
          communication_channels: {
            email_media: { enabled: true },
          }
        }
      );

      const getStagedChanges = () =>(
        {
          shared_personal_data: {
            email: false,
            firstname: true,
          },
          personal_data: {
            firstname: 'Aliceia',
            lastname: 'Atron',
          },
          consents: {
            'New Product Marketing': false,
            'Discount Offers': true,
          },
          communication_channels: {
            email_media: { enabled: false },
            sms_media: { enabled: true },
          }
        }
      );

      let stagedChanges = getStagedChanges();
      let mergedStagedChanges = mergeAccountDataChanges({
        currentAccountData: getCurrentAccountData(),
        stagedChanges,
        newChanges: undefined,
      });
      expect(mergedStagedChanges).not.equal(stagedChanges);
      expect(mergedStagedChanges).to.deep.equal(getStagedChanges());

      stagedChanges = getStagedChanges();
      mergedStagedChanges = mergeAccountDataChanges({
        currentAccountData: getCurrentAccountData(),
        stagedChanges,
        newChanges: {},
      });
      expect(mergedStagedChanges).not.equal(stagedChanges);
      expect(mergedStagedChanges).to.deep.equal(getStagedChanges());
    });
  });

  context('when given newChanges that completely negate the stagedChanges', function() {
    it('should return undefined', function(){
      expect(
        mergeAccountDataChanges({
          currentAccountData: {
            shared_personal_data: {
              email: false,
              firstname: true,
            },
            personal_data: {
              firstname: 'Aliceia',
              lastname: 'Atron',
            },
            consents: {
              'New Product Marketing': false,
              'Discount Offers': true,
            },
            communication_channels: {
              // email_media: { enabled: false },
              sms_media: { enabled: true },
            }
          },
          stagedChanges: {
            shared_personal_data: {
              email: true,
            },
            personal_data: {
              firstname: 'Alice',
            },
            consents: {
              'New Product Marketing': true,
            },
            communication_channels: {
              email_media: { enabled: true },
            }
          },
          newChanges: {
            shared_personal_data: {
              email: false,
            },
            personal_data: {
              firstname: 'Aliceia',
            },
            consents: {
              'New Product Marketing': false,
            },
            communication_channels: {
              email_media: { enabled: false },
            }
          },
        })
      ).to.be.undefined;
    });
  });


  it('should merge shared_personal_data changes', function(){
    expect(
      mergeAccountDataChanges({
        currentAccountData: {
          shared_personal_data: {
            email: true,
            lastname: true,
            firstname: true,
            birthdate: true,
            gender: true,
            mailingcity: false,
            mailingcountry: false,
            mailingpostalcode: false,
            mailingstate: false,
            mailingstreet: false,
            homephone: true,
            mobilephone: true,
            // faxnumber: false,     // lack of presence defaults to false
            // businessphone: false, // lack of presence defaults to false
          },
        },
        stagedChanges: {
          shared_personal_data: {
            email: false,
            lastname: false,
            faxnumber: true,
            businessphone: true,
            mailingstreet: undefined,
          },
        },
        newChanges: {
          shared_personal_data: {
            lastname: true,   // negate change
            birthdate: false, // add change
            gender: true,     // non-change
            mailingstate: undefined, // non-change
          },
        },
      })
    ).to.deep.equal({
      shared_personal_data: {
        email: false,
        birthdate: false,
        faxnumber: true,
        businessphone: true,
      },
    });
  });

  it('should merge personal_data changes', function(){
    expect(
      mergeAccountDataChanges({
        currentAccountData: {
          personal_data: {
            email: 'lucy@daughterofthedevil.tv',
            firstname: 'Licieal',
            lastname: 'Devil',
            birthdate: '',
            gender: '',
            mailingcity: 'Hell',
            mailingcountry: '',
            mailingpostalcode: '',
            mailingstate: '',
            // mailingstreet: '',
            // homephone: '',
            // mobilephone: '',
            // faxnumber: '',
            // businessphone: '',
          },
        },
        stagedChanges: {
          personal_data: {
            firstname: 'Lucy',
            lastname: 'Devil',
            birthdate: '6/6/6',
            gender: 'female',
            homephone: '415-666-6666',
            mailingstate: undefined,
          },
        },
        newChanges: {
          personal_data: {
            firstname: 'Licieal', // negate change
            lastname: 'Devilous', // change change
            faxnumber: '666-666-66666', // add change
            mailingcity: 'Hell', // non-change
            homephone: '', // negate change
            mobilephone: undefined, // non-change
            businessphone: '1-800-google', // add change
          },
        },
      })
    ).to.deep.equal({
      personal_data: {
        lastname: 'Devilous',
        birthdate: '6/6/6',
        gender: 'female',
        faxnumber: '666-666-66666',
        businessphone: '1-800-google',
      },
    });
  });

  it('should merge consents changes', function(){
    expect(
      mergeAccountDataChanges({
        currentAccountData: {
          consents: {
            'Brand Marketing': true,
            'Product Marketing': true,
            'New Product Marketing': true,
            'Specific Product Marketing': true,
            'Discount Offers': true,
            'Partner Offers': true,
            'Customer Research': true,
            'Newsletter': false,
            'Membership': false,
            'Volunteering': false,
            'Fundraising': false,
            // 'Sharing Data within Group': false,
            // 'Sharing Data with Partners': false,
            // 'Automated Decision Making': false,
            'Location Tracking': true,
            'Online Tracking': true,
            'Cross-Border Transfers': true,
          },
        },
        stagedChanges: {
          consents: {
            'Brand Marketing': true, // non-change
            'Product Marketing': false, // add change
            'New Product Marketing': false, // add change
          },
        },
        newChanges: {
          consents: {
            'Product Marketing': true, // negate change
            'Discount Offers': true, // non-change
            'Sharing Data within Group': true, // add change,
          },
        },
      })
    ).to.deep.equal({
      consents: {
        'New Product Marketing': false, // add change
        'Sharing Data within Group': true, // add change,
      }
    });
  });


  it('should merge communication_channels changes', function(){
    expect(
      mergeAccountDataChanges({
        currentAccountData: {
          communication_channels: {
            email_media: { enabled: true },
            fax_media: { enabled: false },
            // postal_mail_media: { enabled: false },
            sms_media: { enabled: true },
            // social_media: { enabled: false },
            // voice_media: { enabled: false },
          },
        },
        stagedChanges: {
          communication_channels: {
            email_media: { enabled: false }, // add change
            fax_media: { enabled: true }, // add change
            social_media: { enabled: false }, // non-change
            voice_media: { enabled: true }, // add change
          },
        },
        newChanges: {
          communication_channels: {
            email_media: { enabled: true }, // negate change
            postal_mail_media: { enabled: false }, // non-change
            sms_media: { enabled: false }, // add change
          },
        },
      })
    ).to.deep.equal({
      communication_channels: {
        fax_media: { enabled: true },
        voice_media: { enabled: true },
        sms_media: { enabled: false },
      },
    });
  });

  it('should work how the portals intend to use it', function(){
    let currentAccountData = {
      shared_personal_data: {
        email: false,
        firstname: true,
      },
      personal_data: {
        firstname: 'Aliceia',
        lastname: 'Atron',
      },
      consents: {
        'New Product Marketing': false,
        'Discount Offers': true,
      },
      communication_channels: {
        sms_media: { enabled: true },
      }
    };
    let stagedChanges;

    const stageChanges = newChanges => {
      stagedChanges = mergeAccountDataChanges({
        currentAccountData,
        stagedChanges,
        newChanges,
      });
    };

    stageChanges(undefined);
    expect(stagedChanges).to.be.undefined;

    stageChanges({});
    expect(stagedChanges).to.be.undefined;

    stageChanges({
      shared_personal_data: {
        email: true,
      },
    });
    expect(stagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
    });

    stageChanges({
      shared_personal_data: {
        email: false,
      },
    });
    expect(stagedChanges).to.be.undefined;

    stageChanges({
      shared_personal_data: {
        email: true,
      },
    });
    expect(stagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
    });

    stageChanges({
      shared_personal_data: {
        firstname: true, // non-change
      },
    });
    expect(stagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
    });

    stageChanges({
      shared_personal_data: {
        booshnozel: true, // non-change
      },
    });
    expect(stagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
    });

    stageChanges({
      consents: {
        'Product Marketing': true, // add change
      },
    });
    expect(stagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
      consents: {
        'Product Marketing': true,
      },
    });

    stageChanges({
      consents: {
        'New Product Marketing': false, // non-change
      },
    });
    expect(stagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
      consents: {
        'Product Marketing': true,
      },
    });

    stageChanges({
      communication_channels: {
        email_media: { enabled: false }, // non-change
      },
    });
    expect(stagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
      consents: {
        'Product Marketing': true,
      },
    });

    stageChanges({
      communication_channels: {
        email_media: { enabled: true }, // add change
      },
    });
    expect(stagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
      consents: {
        'Product Marketing': true,
      },
      communication_channels: {
        email_media: { enabled: true },
      },
    });

    stageChanges({
      shared_personal_data: {
        email: false,
      },
    });
    expect(stagedChanges).to.deep.equal({
      consents: {
        'Product Marketing': true,
      },
      communication_channels: {
        email_media: { enabled: true },
      },
    });

    stageChanges({
      personal_data: {
        gender: 'fluid',
      },
    });
    expect(stagedChanges).to.deep.equal({
      personal_data: {
        gender: 'fluid',
      },
      consents: {
        'Product Marketing': true,
      },
      communication_channels: {
        email_media: { enabled: true },
      },
    });

    stageChanges({
      personal_data: {
        gender: '',
      },
    });
    expect(stagedChanges).to.deep.equal({
      consents: {
        'Product Marketing': true,
      },
      communication_channels: {
        email_media: { enabled: true },
      },
    });
  });
});
