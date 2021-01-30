'use strict';

const { expect } = require('./test/matchers');

require('./organizationMemberships.matchers');

describe('organizationMemberships.matchers', function(){
  const validOrganizationMembership = {
    uid: '56ff8cc9f22bbdf4f1721f149b30115c',
    createdAt: '2020-12-09T20:04:13.320Z',
    organizationApikey: 'WagonCorp',
    memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    updatedAt: '2020-12-09T20:04:13.320Z',
    admin: true,
  };

  it('anOrganizationMembership', function() {
    expect({}).to.not.be.anOrganizationMembership();
    expect(validOrganizationMembership).to.be.anOrganizationMembership();
    expect({
      ...validOrganizationMembership,
      admin: undefined,
      curator: true,
    }).to.be.anOrganizationMembership();
    const failingCase = {
      ...validOrganizationMembership,
      uid: undefined,
    };
    expect(failingCase).to.not.be.anOrganizationMembership();
    expect(() =>
      expect(failingCase).to.be.anOrganizationMembership()
    ).to.throw(`{uid: undefined} didn't match target {uid: 'isUID()'}`);
  });

  it('anOrganizationCuratorMembership', function() {
    expect({
      ...validOrganizationMembership,
      admin: undefined,
      curator: true,
    }).to.be.anOrganizationCuratorMembership();
    expect(validOrganizationMembership).to.not.be.anOrganizationCuratorMembership();
    expect(() =>
      expect(validOrganizationMembership).to.be.anOrganizationCuratorMembership()
    ).to.throw(`{curator: undefined} didn't match target {curator: true}`);
  });

  it('anOrganizationAdminMembership', function() {
    expect(validOrganizationMembership).to.be.anOrganizationAdminMembership();
    const failingCase = {
      ...validOrganizationMembership,
      admin: undefined,
    };
    expect(failingCase).to.not.be.anOrganizationAdminMembership();
    expect(() =>
      expect(failingCase).to.be.anOrganizationAdminMembership()
    ).to.throw(`{admin: undefined} didn't match target {admin: true}`);
  });

  it('anOrganizationMembershipBetween', function() {
    expect({}).to.not.be.anOrganizationMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect({
      ...validOrganizationMembership,
      memberUserDid: 'fakedid',
    }).to.not.be.anOrganizationMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(validOrganizationMembership).to.be.anOrganizationMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    const failingCase = {
      ...validOrganizationMembership,
      organizationApikey: 'badapikey',
    };
    expect(failingCase).to.not.be.anOrganizationMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(() =>
      expect(failingCase).to.be.anOrganizationMembershipBetween({
        organizationApikey: 'WagonCorp',
        memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
      })
    ).to.throw(`expected 'badapikey' to equal 'WagonCorp'`);
  });
  it('anOrganizationCuratorMembershipBetween', function() {
    expect({
      ...validOrganizationMembership,
      curator: true,
    }).to.be.anOrganizationCuratorMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(validOrganizationMembership).to.not.be.anOrganizationCuratorMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(() =>
      expect(validOrganizationMembership).to.be.anOrganizationCuratorMembershipBetween({
        organizationApikey: 'WagonCorp',
        memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
      })
    ).to.throw(`{curator: undefined} didn't match target {curator: true}`);
  });
  it('anOrganizationAdminMembershipBetween', function() {
    expect(validOrganizationMembership).to.be.anOrganizationAdminMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    const failingCase = {
      ...validOrganizationMembership,
      admin: undefined,
      curator: true,
    };
    expect(failingCase).to.not.be.anOrganizationAdminMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(() =>
      expect(failingCase).to.be.anOrganizationAdminMembershipBetween({
        organizationApikey: 'WagonCorp',
        memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
      })
    ).to.throw(`{admin: undefined} didn't match target {admin: true}`);
  });
});
