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
    admin: _.isUndefinedOr(_.isBoolean),
    curator: _.isUndefinedOr(_.isBoolean),
    updatedAt: _.isUndefinedOr(_.isISODateString),
  }
);

definePattern(
  'anOrganizationAdminMembership',
  target => {
    expect(target).to.be.anOrganizationMembership();
    expect(target).to.matchPattern({ admin: true, '...': 1 });
  }
);

definePattern(
  'anOrganizationCuratorMembership',
  target => {
    expect(target).to.be.anOrganizationMembership();
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
