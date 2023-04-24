'use strict';

const mergeAccountData = require('../../mergeAccountData');
const diffAccountData = require('../../diffAccountData');

describe('managing account data', function(){

  it('should be sane', function(){
    expect(mergeAccountData({},{})).to.deep.equal({});
    expect(diffAccountData({},{})).to.be.undefined;

    const currentAccountData = {
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
    };

    const changes = {
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
    };

    const newAccountData = {
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
    };

    expect( mergeAccountData(currentAccountData, changes) ).to.deep.equal(newAccountData);
    expect( diffAccountData(currentAccountData, newAccountData) ).to.deep.equal(changes);
    expect( mergeAccountData(currentAccountData, newAccountData) ).to.deep.equal(newAccountData);
  });

});
