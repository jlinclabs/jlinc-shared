'use strict';

const { _, expect, definePattern } = require('./test/matchers');
require('./createUid.matchers');
require('./organizations.matchers');

definePattern(
  'anOrganizationMembership',
  {
    uid: _.isUID,
    createdAt: _.isISODateString,
    organizationApikey: _.isOrganizationApikey,
    memberUserDid: _.isDID,
    createdByUserDid: _.isDID,
    admin: _.isUndefinedOr(_.isBoolean),
    curator: _.isUndefinedOr(_.isBoolean),
    updatedAt: _.isUndefinedOr(_.isISODateString),
    acceptedAt: _.isUndefinedOr(_.isISODateString),
    rejectedAt: _.isUndefinedOr(_.isISODateString),
    resolvedByUserDid: _.isUndefinedOr(_.isDID),
  }
);

definePattern(
  'anAcceptedOrganizationMembership',
  target => {
    expect(target).to.be.anOrganizationMembership();
    expect(target).to.matchPattern({
      acceptedAt: _.isISODateString,
      rejectedAt: undefined,
      '...': 1
    });
  }
);

definePattern(
  'aRejectedOrganizationMembership',
  target => {
    expect(target).to.be.anOrganizationMembership();
    expect(target).to.matchPattern({
      resolvedByUserDid: _.isDID,
      acceptedAt: undefined,
      rejectedAt: _.isISODateString,
      updatedAt: _.isISODateString,
      '...': 1
    });
  }
);

definePattern(
  'aPendingOrganizationMembership',
  target => {
    expect(target).to.be.anOrganizationMembership();
    expect(target).to.matchPattern({
      resolvedByUserDid: undefined,
      acceptedAt: undefined,
      rejectedAt: undefined,
      '...': 1
    });
  }
);

definePattern(
  'anOrganizationAdminMembership',
  target => {
    expect(target).to.be.anAcceptedOrganizationMembership();
    expect(target).to.matchPattern({ admin: true, '...': 1 });
  }
);

definePattern(
  'anOrganizationCuratorMembership',
  target => {
    expect(target).to.be.anAcceptedOrganizationMembership();
    expect(target).to.matchPattern({ curator: true, '...': 1 });
  }
);

definePattern(
  'anOrganizationMembershipBetween',
  (target, { organizationApikey, memberUserDid }) => {
    expect(target).to.be.anOrganizationMembership();
    expect(target.memberUserDid).to.equal(memberUserDid);
    expect(target.organizationApikey).to.equal(organizationApikey);
  }
);

definePattern(
  'anOrganizationAdminMembershipBetween',
  (target, { organizationApikey, memberUserDid }) => {
    expect(target).to.be.anOrganizationAdminMembership();
    expect(target).to.be.anOrganizationMembershipBetween({
      organizationApikey, memberUserDid,
    });
  }
);

definePattern(
  'anOrganizationCuratorMembershipBetween',
  (target, { organizationApikey, memberUserDid }) => {
    expect(target).to.be.anOrganizationCuratorMembership();
    expect(target).to.be.anOrganizationMembershipBetween({
      organizationApikey, memberUserDid,
    });
  }
);

definePattern(
  'aPendingOrganizationMembershipInviteBetween',
  (target, { organizationApikey, memberUserDid }) => {
    expect(target).to.be.aPendingOrganizationMembership();
    expect(target).to.be.anOrganizationMembershipBetween({
      organizationApikey, memberUserDid,
    });
    expect(target.memberUserDid).to.equal(memberUserDid);
    expect(target.createdByUserDid).to.not.equal(memberUserDid);
  }
);

definePattern(
  'aPendingOrganizationMembershipRequestBetween',
  (target, { organizationApikey, memberUserDid }) => {
    expect(target).to.be.aPendingOrganizationMembership();
    expect(target).to.be.anOrganizationMembershipBetween({
      organizationApikey, memberUserDid,
    });
    expect(target.memberUserDid).to.equal(memberUserDid);
    expect(target.createdByUserDid).to.equal(memberUserDid);
  }
);

definePattern(
  'anAcceptedOrganizationMembershipBetween',
  (target, { organizationApikey, memberUserDid }) => {
    expect(target).to.be.anAcceptedOrganizationMembership();
    expect(target).to.be.anOrganizationMembershipBetween({
      organizationApikey, memberUserDid,
    });
  }
);


