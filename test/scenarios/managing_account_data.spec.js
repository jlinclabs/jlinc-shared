'use strict';

const deepfreeze = require('deep-freeze-node');
const DEFAULT_ACCOUNT_DATA = require('../../default_account_data');
const mergeAccountData = require('../../mergeAccountData');
const diffAccountData = require('../../diffAccountData');
const stripNonRequestedAccountData = require('../../stripNonRequestedAccountData');

describe('managing account data', function(){

  it('should be sane', function(){
    expect(mergeAccountData({},{})).to.deep.equal({});
    expect(diffAccountData({},{})).to.be.undefined;

    const currentAccountData = deepfreeze({
      shared_personal_data: {
        email: true,
        firstname: true,
        lastname: true,
      },
      personal_data: {
        email: 'alice@example.com',
        firstname: 'Alice',
        lastname: 'McMaster',
      },
      consents: {
        'Brand Marketing': true,
        'Product Marketing': true,
      },
      communication_channels: {
        email_media: { enabled: true },
        fax_media: { enabled: true },
      },
    });

    const changes = deepfreeze({
      shared_personal_data: {
        lastname: false,
        salutation: true,
      },
      personal_data: {
        lastname: 'McMalister',
        salutation: 'Lordess',
      },
      consents: {
        'Product Marketing': false,
        'New Product Marketing': true,
      },
      communication_channels: {
        fax_media: { enabled: false },
        postal_mail_media: { enabled: true },
      },
    });

    const newAccountData = deepfreeze({
      shared_personal_data: {
        email: true,
        firstname: true,
        lastname: false,
        salutation: true,
      },
      personal_data: {
        email: 'alice@example.com',
        firstname: 'Alice',
        lastname: 'McMalister',
        salutation: 'Lordess',
      },
      consents: {
        'Brand Marketing': true,
        'Product Marketing': false,
        'New Product Marketing': true,
      },
      communication_channels: {
        email_media: { enabled: true },
        fax_media: { enabled: false },
        postal_mail_media: { enabled: true },
      },
    });

    expect( mergeAccountData(currentAccountData, changes) ).to.deep.equal(newAccountData);
    expect( diffAccountData(currentAccountData, newAccountData) ).to.deep.equal(changes);
    expect( mergeAccountData(currentAccountData, newAccountData) ).to.deep.equal(newAccountData);
  });

  context('when staging default account data changes', function(){
    let defaultAccountData;
    let defaultAccountDataStagedChanges;

    const stageDefaultAccountDataChanges = function(changes){
      if (defaultAccountDataStagedChanges)
        changes = mergeAccountData(defaultAccountDataStagedChanges, changes);
      defaultAccountDataStagedChanges = diffAccountData(
        defaultAccountData,
        mergeAccountData(defaultAccountData, changes),
      );
    };

    beforeEach(function(){
      defaultAccountData = mergeAccountData(DEFAULT_ACCOUNT_DATA, {});
      defaultAccountDataStagedChanges = undefined;
    });

    context('that are not a valid account data keys', function(){
      it('should ignore those changes', function(){
        stageDefaultAccountDataChanges({
          bullshit: 'righthere',
          shared_personal_data: {
            moreBS: true,
          }
        });
        expect(defaultAccountDataStagedChanges).to.be.undefined;
      });
    });

    context('that are the same as the stored value', function(){
      it('should remove those changes from the stage', function(){
        stageDefaultAccountDataChanges({
          shared_personal_data: {
            email: true,
          },
          personal_data: {
            email: null,
          },
          consents: {
            'Brand Marketing': false,
          },
          communication_channels: {
            email_media: { enabled: false },
          },
        });
        expect(defaultAccountDataStagedChanges).to.be.undefined;

        stageDefaultAccountDataChanges({
          shared_personal_data: {
            email: false,
          },
          personal_data: {
            email: 'alice@example.com',
          },
          consents: {
            'Brand Marketing': true,
          },
          communication_channels: {
            email_media: { enabled: true },
          },
        });
        expect(defaultAccountDataStagedChanges).to.deep.equal({
          shared_personal_data: {
            email: false,
          },
          personal_data: {
            email: 'alice@example.com',
          },
          consents: {
            'Brand Marketing': true,
          },
          communication_channels: {
            email_media: { enabled: true },
          },
        });

        stageDefaultAccountDataChanges({
          shared_personal_data: {
            email: true,
          },
        });
        expect(defaultAccountDataStagedChanges).to.deep.equal({
          personal_data: {
            email: 'alice@example.com',
          },
          consents: {
            'Brand Marketing': true,
          },
          communication_channels: {
            email_media: { enabled: true },
          },
        });

        stageDefaultAccountDataChanges({
          personal_data: {
            email: null,
          },
        });
        expect(defaultAccountDataStagedChanges).to.deep.equal({
          consents: {
            'Brand Marketing': true,
          },
          communication_channels: {
            email_media: { enabled: true },
          },
        });

        stageDefaultAccountDataChanges({
          consents: {
            'Brand Marketing': false,
          },
          communication_channels: {
            email_media: { enabled: false },
          },
        });
        expect(defaultAccountDataStagedChanges).to.be.undefined;
      });
    });

    context('that are the different from the stored value', function(){
      it('should add those changes to the stage', function(){
        stageDefaultAccountDataChanges({
          shared_personal_data: {
            email: false,
          },
          personal_data: {
            email: 'alice@example.com',
          },
          consents: {
            'Brand Marketing': true,
          },
          communication_channels: {
            email_media: { enabled: true },
          },
        });
        expect(defaultAccountDataStagedChanges).to.deep.equal({
          shared_personal_data: {
            email: false,
          },
          personal_data: {
            email: 'alice@example.com',
          },
          consents: {
            'Brand Marketing': true,
          },
          communication_channels: {
            email_media: { enabled: true },
          },
        });
      });
    });

  });

  context('when staging organization account data changes', function(){
    let organizationRequestedData;
    let organizationAccountData;
    let organizationAccountDataStagedChanges;

    const stageOrganizationAccountDataChange = function(changes){
      organizationAccountDataStagedChanges = stripNonRequestedAccountData(
        diffAccountData(
          organizationAccountData,
          mergeAccountData(organizationAccountData, changes),
        ),
        organizationRequestedData,
      );
    };

    beforeEach(function(){
      organizationRequestedData = {
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
          email_media: true,
          fax_media: true,
        },
      };
      organizationAccountData = stripNonRequestedAccountData(
        mergeAccountData(DEFAULT_ACCOUNT_DATA),
        organizationRequestedData,
      );
      organizationAccountDataStagedChanges = undefined;
    });

    context('that contains invalid account data keys', function(){
      it('should only stage the good keys', function(){
        stageOrganizationAccountDataChange({
          bullshit: 'righthere',
          shared_personal_data: {
            moreBS: true,
            firstname: false,
          }
        });
        expect(organizationAccountDataStagedChanges).to.deep.equal({
          shared_personal_data: {
            firstname: false,
          },
        });
      });
    });

    context('that contains key that are not requested by the organization', function(){
      it('should only stage the keys requested by the organization', function(){
        stageOrganizationAccountDataChange({
          shared_personal_data: {
            firstname: false,
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
            firstname: false,
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

  context('when applying default account data to an organization', function(){
    context('when applying a change to a field that is not requested by the organization', function(){
      it('should ignore the change');
    });
  });

  context('when applying an organizations account data to your default account data', function(){

  });

});
