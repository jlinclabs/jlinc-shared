'use strict';

const deepfreeze = require('deep-freeze-node');
const PERSONAL_DATA_KEYS = require('../personal_data_keys');
const CONSENTS = require('../consents');
const COMMUNICATION_CHANNELS = require('../communication_channels');
// const normalizeAccountData = require('../normalizeAccountData');
const stageAccountDataChanges = require('../stageAccountDataChanges');


const arrayToObjectWithValue = (keys, value) =>
  keys.reduce((result, key) => ({...result, [key]: value}), {})
;

const ALL_REQUESTED_DATA = deepfreeze({
  personal_data: arrayToObjectWithValue(PERSONAL_DATA_KEYS, true),
  consents: arrayToObjectWithValue(CONSENTS, true),
  communication_channels: arrayToObjectWithValue(COMMUNICATION_CHANNELS, true),
});

const SOME_REQUESTED_DATA = deepfreeze({
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
});

describe('stageAccountDataChanges', function(){

  it('it should return an object that contains only the requested changes', function(){
    expect(
      stageAccountDataChanges({
        requestedData: ALL_REQUESTED_DATA,
        accountData: {},
        changes: {},
      })
    ).to.be.undefined;

    expect(
      stageAccountDataChanges({
        requestedData: ALL_REQUESTED_DATA,
        accountData: {
          shared_personal_data: {
            email: true,
            firstname: true,
          },
          personal_data: {
            email: 'alice@example.com',
            firstname: 'Alice',
          },
          consents: {
            'Brand Marketing': true,
            'Product Marketing': false,
          },
          communication_channels: {
            'email_media': { enabled: true },
            'fax_media': { enabled: false },
          },
        },
        changes: {},
      })
    ).to.be.undefined;

    expect(
      stageAccountDataChanges({
        requestedData: ALL_REQUESTED_DATA,
        accountData: {
          shared_personal_data: {
            email: true,
            firstname: true,
          },
          personal_data: {
            email: 'alice@example.com',
            firstname: 'Alice',
          },
          consents: {
            'Brand Marketing': true,
            'Product Marketing': false,
          },
          communication_channels: {
            'email_media': { enabled: true },
            'fax_media': { enabled: false },
          },
        },
        changes: {
          personal_data: {
            lastname: 'McPeterson',
          },
        },
      })
    ).to.deep.equal({
      personal_data: {
        lastname: 'McPeterson',
      },
    });

    expect(
      stageAccountDataChanges({
        requestedData: ALL_REQUESTED_DATA,
        accountData: {},
        changes: {
          shared_personal_data: {
            email: true,
            firstname: false,
          },
          personal_data: {
            email: 'alice@example.com',
            firstname: '',
          },
          consents: {
            'Brand Marketing': true,
            'Product Marketing': false,
          },
          communication_channels: {
            'email_media': { enabled: true },
            'fax_media': { enabled: false },
          },
        },
      })
    ).to.deep.equal({
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
        'email_media': { enabled: true },
      },
    });

    expect(
      stageAccountDataChanges({
        requestedData: ALL_REQUESTED_DATA,
        accountData: {},
        changes: {
          shared_personal_data: {
            email: true,
          },
          personal_data: {
            email: 'alice@example.com',
          },
          consents: {
            'Brand Marketing': true,
            'Product Marketing': true,
          },
          communication_channels: {
            'email_media': { enabled: true },
            'fax_media': { enabled: true },
          },
        },
      })
    ).to.deep.equal({
      shared_personal_data: {
        email: true,
      },
      personal_data: {
        email: 'alice@example.com',
      },
      consents: {
        'Brand Marketing': true,
        'Product Marketing': true,
      },
      communication_channels: {
        'email_media': { enabled: true },
        'fax_media': { enabled: true },
      },
    });

    expect(
      stageAccountDataChanges({
        requestedData: SOME_REQUESTED_DATA,
        accountData: {},
        changes: {},
      })
    ).to.be.undefined;

    expect(
      stageAccountDataChanges({
        requestedData: SOME_REQUESTED_DATA,
        accountData: {
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
            'email_media': { enabled: true },
          },
        },
        changes: {},
      })
    ).to.be.undefined;

    expect(
      stageAccountDataChanges({
        requestedData: SOME_REQUESTED_DATA,
        accountData: {
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
            'email_media': { enabled: true },
          },
        },
        changes: {
          shared_personal_data: {
            gender: true,
          },
          personal_data: {
            homephone: '415-555-5555',
          },
          consents: {
            'Discount Offers': true,
          },
          communication_channels: {
            twitter: { enabled: true },
          },
        },
      })
    ).to.be.undefined;
  });

});
