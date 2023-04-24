'use strict';

const stageAccountDataChanges = require('../../stageAccountDataChanges');

const normalizeAccountData = require('../../normalizeAccountData');
const mergeAccountData = require('../../mergeAccountData');

describe('staging organization account data changes', function(){
  let organizationAccountData;
  let organizationAccountDataStagedChanges;
  let requestedData;

  const stageOrganizationAccountDataChanges = function(changes){
    organizationAccountDataStagedChanges = stageAccountDataChanges({
      organizationAccountData,
      changes: mergeAccountData(organizationAccountDataStagedChanges, changes),
      requestedData,
    });
  };

  beforeEach(function(){
    organizationAccountData = normalizeAccountData();
    organizationAccountDataStagedChanges = undefined;
    requestedData = {
      personal_data: {
        email: true,
        firstname: true,
        lastname: true,
      },
      consents: {
        'Brand Marketing': true,
        'Product Marketing': true,
      },
      communication_channels: {
        'email_media': true,
        'fax_media': true,
      },
    };
  });

  it('should work as expected', function(){
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    // when staging nothing
    stageOrganizationAccountDataChanges({});
    // the stage should be undefined
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    // when staging a real change
    stageOrganizationAccountDataChanges({
      shared_personal_data: {
        firstname: true,
      },
    });
    // the change should be staged
    expect(organizationAccountDataStagedChanges).to.deep.equal({
      shared_personal_data: {
        firstname: true,
      },
    });

    // when staging a negating change
    stageOrganizationAccountDataChanges({
      shared_personal_data: {
        firstname: false,
      },
    });
    // the stage should be undefined
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    // when staging a real change
    stageOrganizationAccountDataChanges({
      personal_data: {
        firstname: 'Alice',
      },
    });
    // the change should be staged
    expect(organizationAccountDataStagedChanges).to.deep.equal({
      personal_data: {
        firstname: 'Alice',
      },
    });

    // when staging a negating change
    stageOrganizationAccountDataChanges({
      personal_data: {
        firstname: '',
      },
    });
    // the stage should be undefined
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    // when staging bad keys
    stageOrganizationAccountDataChanges({
      BAD_KEY: true,
      shared_personal_data: {
        ANOTHER_BAD_KEY: true,
      }
    });
    // the stage should be undefined
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    // when staging a change not requested by the organization
    stageOrganizationAccountDataChanges({
      shared_personal_data: {
        gender: true,
      },
      personal_data: {
        gender: 'complicated',
      },
    });
    // the stage should be undefined
    expect(organizationAccountDataStagedChanges).to.be.undefined;
  });
  it('should only stage keys that are different from the current organizationAccountData', function(){
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    stageOrganizationAccountDataChanges({});
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    stageOrganizationAccountDataChanges({
      shared_personal_data: {
        email: false,
      }
    });
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    stageOrganizationAccountDataChanges({
      shared_personal_data: {
        email: true,
        firstname: false,
      }
    });
    expect(organizationAccountDataStagedChanges).to.deep.equal({
      shared_personal_data: {
        email: true,
      }
    });

    stageOrganizationAccountDataChanges({
      shared_personal_data: {
        email: false,
        firstname: false,
      }
    });
    expect(organizationAccountDataStagedChanges).to.be.undefined;

    stageOrganizationAccountDataChanges({
      consents: {
        'Brand Marketing': true,
      }
    });
    expect(organizationAccountDataStagedChanges).to.deep.equal({
      consents: {
        'Brand Marketing': true,
      }
    });

    stageOrganizationAccountDataChanges({
      consents: {
        'Product Marketing': true,
      }
    });
    expect(organizationAccountDataStagedChanges).to.deep.equal({
      consents: {
        'Brand Marketing': true,
        'Product Marketing': true,
      }
    });

    stageOrganizationAccountDataChanges({
      consents: {
        'Product Marketing': false,
      }
    });
    expect(organizationAccountDataStagedChanges).to.deep.equal({
      consents: {
        'Brand Marketing': true,
      }
    });

    stageOrganizationAccountDataChanges({
      consents: {
        'Brand Marketing': false
      }
    });
    expect(organizationAccountDataStagedChanges).to.be.undefined;

  });

  context('that contains invalid account data keys', function(){
    it('should only stage the good keys', function(){
      stageOrganizationAccountDataChanges({
        bullshit: 'righthere',
        shared_personal_data: {
          moreBS: true,
          firstname: true,
        }
      });
      expect(organizationAccountDataStagedChanges).to.deep.equal({
        shared_personal_data: {
          firstname: true,
        },
      });
    });
  });

  context('that contains key that are not requested by the organization', function(){
    it('should only stage the keys requested by the organization', function(){
      stageOrganizationAccountDataChanges({
        shared_personal_data: {
          firstname: true,
          salutation: true,
        },
        personal_data: {
          email: 'alice@example.com',
          salutation: 'Lordess',
        },
        consents: {
          'Product Marketing': true,
          'New Product Marketing': true,
        },
        communication_channels: {
          fax_media: { enabled: true },
          postal_mail_media: { enabled: true },
        },
      });
      expect(organizationAccountDataStagedChanges).to.deep.equal({
        shared_personal_data: {
          firstname: true,
        },
        personal_data: {
          email: 'alice@example.com',
        },
        consents: {
          'Product Marketing': true,
        },
        communication_channels: {
          fax_media: { enabled: true },
        }
      });
    });
  });
});

