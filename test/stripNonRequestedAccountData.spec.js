'use strict';

const DEFAULT_ACCOUNT_DATA = require('../default_account_data');
const stripNonRequestedAccountData = require('../stripNonRequestedAccountData');

describe('stripNonRequestedAccountData', function(){

  context('when missing required arguments', function(){
    it('should throw and error', function(){
      expect(() => { stripNonRequestedAccountData(); }).to.throw('accountData is required');
      expect(() => { stripNonRequestedAccountData({}); }).to.throw('requestedData is required');
    });
  });

  context('when the organization requests no data fields', function(){
    it('should strip out all sections but shared_personal_data', function(){
      expect(
        stripNonRequestedAccountData(
          DEFAULT_ACCOUNT_DATA,
          {}
        )
      ).to.deep.equal({
        shared_personal_data: {},
        personal_data: {},
        consents: {},
        communication_channels: {},
      });
    });
  });

  context('when the organization requests only some data fields', function(){
    it('should strip out all sections but shared_personal_data', function(){
      expect(
        stripNonRequestedAccountData(
          DEFAULT_ACCOUNT_DATA,
          {
            personal_data: {
              email: true,
              firstname: true,
              lastname: false,
            },
            consents: {
              'Brand Marketing': true,
              'Product Marketing': true,
              'New Product Marketing': false,
            },
            communication_channels: {
              email_media: true,
              fax_media: true,
              postal_mail_media: false,
            }
          }
        )
      ).to.deep.equal({
        shared_personal_data: {
          email: true,
          firstname: true,
        },
        personal_data: {
          email: null,
          firstname: null,
        },
        consents: {
          'Brand Marketing': false,
          'Product Marketing': false,
        },
        communication_channels: {
          email_media: { enabled: false },
          fax_media: { enabled: false },
        },
      });
    });
  });

  it('should strip out non requested accound data keys', function(){
    const getAccountData = () => ({
      shared_personal_data: {
        birthdate: false,
        businessphone: true,
      },
      personal_data: {
        email: 'morty@sanchez.me',
        firstname: "Morty",
        lastname: "Sanchez",
      },
      consents: {
        Newsletter: true,
        Membership: false,
        Volunteering: true,
        Fundraising: false,
      },
      communication_channels: {
        email_media: { enabled: true },
        fax_media: { enabled: false },
      },
    });

    expect(
      stripNonRequestedAccountData(
        getAccountData(),
        {}
      )
    ).to.deep.equal({
      shared_personal_data: {},
      personal_data: {},
      consents: {},
      communication_channels: {},
    });

    expect(
      stripNonRequestedAccountData(
        getAccountData(),
        {
          personal_data: {
            email: true,
          },
          consents: {
            Membership: true,
          },
          communication_channels: {
            fax_media: true,
          }
        }
      )
    ).to.deep.equal({
      shared_personal_data: {
      },
      personal_data: {
        email: 'morty@sanchez.me',
      },
      consents: {
        Membership: false,
      },
      communication_channels: {
        fax_media: { enabled: false },
      },
    });


    expect(
      stripNonRequestedAccountData(
        getAccountData(),
        {
          personal_data: {
            firstname: true,
            lastname: false,
          },
          consents: {
            Newsletter: true,
            Membership: true,
            Volunteering: false,
          },
          communication_channels: {
            email_media: true,
            fax_media: false,
          }
        }
      )
    ).to.deep.equal({
      shared_personal_data: {
      },
      personal_data: {
        firstname: "Morty",
      },
      consents: {
        Newsletter: true,
        Membership: false,
      },
      communication_channels: {
        email_media: { enabled: true },
      },
    });
  });

  context('when given an accountData object with missing sections', function(){
    it('should not add those secstions back in', function(){
      expect(
        stripNonRequestedAccountData(
          {},
          {}
        )
      ).to.deep.equal({});

      expect(
        stripNonRequestedAccountData(
          {},
          {
            personal_data: {
              email: true,
              firstname: true,
              lastname: false,
            },
            consents: {
              'Brand Marketing': true,
              'Product Marketing': true,
              'New Product Marketing': false,
            },
            communication_channels: {
              email_media: true,
              fax_media: true,
              postal_mail_media: false,
            }
          }
        )
      ).to.deep.equal({});
    });
  });
});
