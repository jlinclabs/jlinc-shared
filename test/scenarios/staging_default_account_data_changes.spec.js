'use strict';

const stageAccountDataChanges = require('../../stageAccountDataChanges');

const normalizeAccountData = require('../../normalizeAccountData');
const mergeAccountData = require('../../mergeAccountData');

describe('staging default account data changes', function(){
  let defaultAccountData;
  let defaultAccountDataStagedChanges;

  const stageDefaultAccountDataChanges = function(changes){
    defaultAccountDataStagedChanges = stageAccountDataChanges({
      defaultAccountData,
      changes: mergeAccountData(defaultAccountDataStagedChanges, changes),
    });
  };

  beforeEach(function(){
    defaultAccountData = normalizeAccountData();
    defaultAccountDataStagedChanges = undefined;
  });

  it('should work as expected', function(){
    expect(defaultAccountDataStagedChanges).to.be.undefined;

    // when staging nothing
    stageDefaultAccountDataChanges({});
    // the stage should be undefined
    expect(defaultAccountDataStagedChanges).to.be.undefined;

    // when staging a real change
    stageDefaultAccountDataChanges({
      shared_personal_data: {
        firstname: true,
      },
    });
    // the change should be staged
    expect(defaultAccountDataStagedChanges).to.deep.equal({
      shared_personal_data: {
        firstname: true,
      },
    });

    // when staging a negating change
    stageDefaultAccountDataChanges({
      shared_personal_data: {
        firstname: false,
      },
    });
    // the stage should be undefined
    expect(defaultAccountDataStagedChanges).to.be.undefined;

    // when staging a real change
    stageDefaultAccountDataChanges({
      personal_data: {
        firstname: 'Alice',
      },
    });
    // the change should be staged
    expect(defaultAccountDataStagedChanges).to.deep.equal({
      personal_data: {
        firstname: 'Alice',
      },
    });

    // when staging a negating change
    stageDefaultAccountDataChanges({
      personal_data: {
        firstname: '',
      },
    });
    // the stage should be undefined
    expect(defaultAccountDataStagedChanges).to.be.undefined;

    // when staging bad keys
    stageDefaultAccountDataChanges({
      BAD_KEY: true,
      shared_personal_data: {
        ANOTHER_BAD_KEY: true,
      }
    });
    // the stage should be undefined
    expect(defaultAccountDataStagedChanges).to.be.undefined;
  });

  context('that are not valid account data keys', function(){
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
      stageDefaultAccountDataChanges(normalizeAccountData());
      expect(defaultAccountDataStagedChanges).to.be.undefined;

      stageDefaultAccountDataChanges({
        shared_personal_data: {
          email: false,
        },
        personal_data: {
          email: '',
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
          email: true,
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
          email: true,
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
          email: false,
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
          email: '',
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
          email: true,
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
          email: true,
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

