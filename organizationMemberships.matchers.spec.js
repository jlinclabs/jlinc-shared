'use strict';

const { expect } = require('./test/matchers');

require('./organizationMemberships.matchers');

describe('organizationMemberships.matchers', function(){
  const acceptedOrganizationMembership = {
    uid: '56ff8cc9f22bbdf4f1721f149b30115c',
    createdAt: '2020-12-09T20:04:13.320Z',
    organizationApikey: 'WagonCorp',
    memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    createdByUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    updatedAt: '2020-12-09T20:04:13.320Z',
    acceptedAt: '2020-12-09T20:04:13.320Z',
    admin: true,
  };

  it('anOrganizationMembership', function() {
    expect({}).to.not.be.anOrganizationMembership();
    expect(acceptedOrganizationMembership).to.be.anOrganizationMembership();
    expect({
      ...acceptedOrganizationMembership,
      admin: undefined,
      curator: true,
    }).to.be.anOrganizationMembership();
    const failingCase = {
      ...acceptedOrganizationMembership,
      uid: undefined,
    };
    expect(failingCase).to.not.be.anOrganizationMembership();
    expect(() =>
      expect(failingCase).to.be.anOrganizationMembership()
    ).to.throw(`{uid: undefined} didn't match target {uid: 'isUID()'}`);
  });

  it('anAcceptedOrganizationMembership', function() {
    expect(acceptedOrganizationMembership).to.be.anAcceptedOrganizationMembership();
    const failingCase = {
      ...acceptedOrganizationMembership,
      acceptedAt: undefined,
    };
    expect(failingCase).to.not.be.anAcceptedOrganizationMembership();
    expect(() =>
      expect(failingCase).to.be.anAcceptedOrganizationMembership()
    ).to.throw(`{acceptedAt: undefined} didn't match target {acceptedAt: 'isISODateString()'}`);
  });
  it('aRejectedOrganizationMembership', function() {
    expect({
      ...acceptedOrganizationMembership,
      rejectedAt: '2020-12-09T20:04:13.320Z',
      resolvedByUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
      acceptedAt: undefined,
    }).to.be.aRejectedOrganizationMembership();
    expect(acceptedOrganizationMembership).to.not.be.aRejectedOrganizationMembership();
    expect(() =>
      expect(acceptedOrganizationMembership).to.be.aRejectedOrganizationMembership()
    ).to.throw(`{resolvedByUserDid: undefined} didn't match target {resolvedByUserDid: 'isDID()'}`);
  });
  it('aPendingOrganizationMemberhip', function() {
    expect({
      ...acceptedOrganizationMembership,
      updatedAt: undefined,
      acceptedAt: undefined,
    }).to.be.aPendingOrganizationMembership();
    expect(acceptedOrganizationMembership).to.not.be.aPendingOrganizationMembership();
    expect(() =>
      expect(acceptedOrganizationMembership).to.be.aPendingOrganizationMembership()
    ).to.throw(`{acceptedAt: '2020-12-09T20:04:13.320Z'} didn't match target {acceptedAt: undefined}`);
  });

  it('anOrganizationCuratorMembership', function() {
    expect({
      ...acceptedOrganizationMembership,
      admin: undefined,
      curator: true,
    }).to.be.anOrganizationCuratorMembership();
    expect(acceptedOrganizationMembership).to.not.be.anOrganizationCuratorMembership();
    expect(() =>
      expect(acceptedOrganizationMembership).to.be.anOrganizationCuratorMembership()
    ).to.throw(`{curator: undefined} didn't match target {curator: true}`);
  });

  it('anOrganizationAdminMembership', function() {
    expect(acceptedOrganizationMembership).to.be.anOrganizationAdminMembership();
    const failingCase = {
      ...acceptedOrganizationMembership,
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
      ...acceptedOrganizationMembership,
      memberUserDid: 'fakedid',
    }).to.not.be.anOrganizationMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(acceptedOrganizationMembership).to.be.anOrganizationMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    const failingCase = {
      ...acceptedOrganizationMembership,
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
      ...acceptedOrganizationMembership,
      curator: true,
    }).to.be.anOrganizationCuratorMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(acceptedOrganizationMembership).to.not.be.anOrganizationCuratorMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(() =>
      expect(acceptedOrganizationMembership).to.be.anOrganizationCuratorMembershipBetween({
        organizationApikey: 'WagonCorp',
        memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
      })
    ).to.throw(`{curator: undefined} didn't match target {curator: true}`);
  });
  it('anOrganizationAdminMembershipBetween', function() {
    expect(acceptedOrganizationMembership).to.be.anOrganizationAdminMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    const failingCase = {
      ...acceptedOrganizationMembership,
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
  it('aPendingOrganizationMembershipInviteBetween', function() {
    expect({
      ...acceptedOrganizationMembership,
      acceptedAt: undefined,
      updatedAt: undefined,
      createdByUserDid: 'did:jlinc:AdfNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApKJOrPs'
    }).to.be.aPendingOrganizationMembershipInviteBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(acceptedOrganizationMembership).to.not.be.aPendingOrganizationMembershipInviteBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(() =>
      expect(acceptedOrganizationMembership).to.be.aPendingOrganizationMembershipInviteBetween({
        organizationApikey: 'WagonCorp',
        memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
      })
    ).to.throw(`{acceptedAt: '2020-12-09T20:04:13.320Z'} didn't match target {acceptedAt: undefined}`);
  });
  it('aPendingOrganizationMembershipRequestBetween', function() {
    expect({
      ...acceptedOrganizationMembership,
      acceptedAt: undefined,
      updatedAt: undefined,
    }).to.be.aPendingOrganizationMembershipRequestBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(acceptedOrganizationMembership).to.not.be.aPendingOrganizationMembershipRequestBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(() =>
      expect(acceptedOrganizationMembership).to.be.aPendingOrganizationMembershipRequestBetween({
        organizationApikey: 'WagonCorp',
        memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
      })
    ).to.throw(`{acceptedAt: '2020-12-09T20:04:13.320Z'} didn't match target {acceptedAt: undefined}`);
  });
  it('anAcceptedOrganizationMembershipBetween', function() {
    expect(acceptedOrganizationMembership).to.be.anAcceptedOrganizationMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    const failingCase = {
      ...acceptedOrganizationMembership,
      acceptedAt: undefined,
    };
    expect(failingCase).to.not.be.anAcceptedOrganizationMembershipBetween({
      organizationApikey: 'WagonCorp',
      memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
    });
    expect(() =>
      expect(failingCase).to.be.anAcceptedOrganizationMembershipBetween({
        organizationApikey: 'WagonCorp',
        memberUserDid: 'did:jlinc:XdsNStmHbQzSfaUx8f7r8BG-oJAnaXhoQeDApBJOrXs',
      })
    ).to.throw(`{acceptedAt: undefined} didn't match target {acceptedAt: 'isISODateString()'}`);
  });
});
