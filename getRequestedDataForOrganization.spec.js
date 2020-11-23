'use strict';

const getRequestedDataForOrganization = require('./getRequestedDataForOrganization');

describe('getRequestedDataForOrganization', function(){
  it('should extract requested data from an organization', function(){
    expect(
      getRequestedDataForOrganization({})
    ).to.deep.equal({
      personal_data: {},
      consents: {},
      communication_channels: {},
    });

    expect(
      getRequestedDataForOrganization({
        requested_data: {},
        consents: {},
        communication_channels: {},
      })
    ).to.deep.equal({
      personal_data: {},
      consents: {},
      communication_channels: {},
    });

    expect(
      getRequestedDataForOrganization({
        requested_data: {
          firstname: true,
          lastname: false,
        },
        consents: {
          'Brand Marketing': {},
          'Product Marketing': { enabled: true },
          'New Product Marketing': { enabled: false },
        },
        communication_channels: {
          email_media: true,
          fax_media: false,
        },
      })
    ).to.deep.equal({
      personal_data: {
        firstname: true,
        lastname: false,
      },
      consents: {
        'Brand Marketing': false,
        'Product Marketing': true,
        'New Product Marketing': false,
      },
      communication_channels: {
        email_media: true,
        fax_media: false,
      },
    });
  });
});
