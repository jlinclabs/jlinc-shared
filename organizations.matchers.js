'use strict';

const { _, definePattern } = require('./test/matchers');
require('./assets.matchers');

const ORGANIZATION_TYPES_BY_PURPOSE = require('./organization_types_by_purpose');
const CONSENTS_KEYS = require('./consents');
const PERSONAL_DATA_KEYS = require('./personal_data_keys');
const COMMUNICATION_CHANNEL_KEYS = require('./communication_channels');

definePattern('anOrganizationApikey', /^[a-z][a-z0-9]{2,30}$/i);

definePattern('anOrganizationPurpose',
  _.isIncludedIn(Object.keys(ORGANIZATION_TYPES_BY_PURPOSE)),
);

definePattern('anOrganizationType',
  _.isIncludedIn(
    _.flatten(Object.values(ORGANIZATION_TYPES_BY_PURPOSE))
  ),
);

definePattern('organizationConcents',
  CONSENTS_KEYS.reduce(
    (pattern, key) => {
      pattern[key] = _.isSome(_.isUndefined, {enabled: _.isBoolean});
      return pattern;
    },
    {}
  )
);

definePattern('organizationRequestedData', target => {
  expect(target).to.be.aPlainObject();
  for (let key in target) {
    if (
      (!PERSONAL_DATA_KEYS.includes(key) && !key.match(/^_.+$/)) ||
      !_.isBoolean(target[key])) return false;
  }
  return true;
});

definePattern('organizationCommunicationChannels',
  COMMUNICATION_CHANNEL_KEYS.reduce(
    (pattern, key) => {
      pattern[key] = _.isSome(_.isUndefined, _.isBoolean);
      return pattern;
    },
    {}
  )
);

definePattern('anOrganization', {
  address: _.isStringOrNull,
  apikey: _.isOrganizationApikey,
  business_banner: _.isOneOf(_.isUndefined, _.isStringOrNull),
  business_description: _.isOneOf(_.isUndefined, _.isStringOrNull),
  business_email: _.isOneOf(_.isUndefined, _.isNull, _.isEmail),
  business_icon: _.isOneOf(_.isUndefined, _.isNull, _.isAssetUrl),
  business_logo: _.isOneOf(_.isUndefined, _.isNull, _.isAssetUrl),
  business_marketplace_brands: _.isOneOf(_.isUndefined, _.isArray),
  business_marketplace_industries: _.isOneOf(_.isUndefined, _.isArray),
  business_marketplace_tags: _.isOneOf(_.isUndefined, _.isArray),
  business_phone: _.isStringOrNull,
  stripe_city: _.isStringOrNull,
  stripe_country: _.isStringOrNull,
  stripe_name: _.isStringOrNull,
  stripe_post_code: _.isStringOrNull,
  stripe_state: _.isStringOrNull,
  stripe_street: _.isStringOrNull,
  city: _.isStringOrNull,
  closed_memberships: _.isBoolean,
  communication_channels: _.isOrganizationCommunicationChannels,
  consents: _.isOrganizationConcents,
  consumer_banner: _.isOneOf(_.isNull, _.isAssetUrl),
  consumer_description: _.isString,
  consumer_icon: _.isOneOf(_.isNull, _.isAssetUrl),
  consumer_marketplace_brands: _.isOneOf(_.isUndefined, _.isArray),
  consumer_marketplace_industries: _.isOneOf(_.isUndefined, _.isArray),
  consumer_marketplace_tags: _.isOneOf(_.isUndefined, _.isArray),
  contact_phone: _.isStringOrNull,
  contact_phone_2: _.isStringOrNull,
  country: _.isStringOrNull,
  // TODO
  // created_at:  _.isDateString,
  created_at:  _.isOneOf(_.isUndefined, _.isDateString),
  did: _.isDID,
  display_end_user_did: _.isBoolean,
  domain: _.isStringOrNull,
  dpo_email: _.isEmail,
  ein: _.isStringOrNull,
  is_closed: _.isBoolean,
  is_network: _.isBoolean,
  is_private: _.isBoolean,
  legal_name: _.isStringOrNull,
  name: _.isStringOrNull,
  post_code: _.isStringOrNull,
  prefered_contact_channel: _.isIncludedIn([null, 'mobile', 'email']),
  public: _.isBoolean,
  public_allowed: _.isOneOf(_.isUndefined, _.isBoolean),
  public_to_orgs: _.isOneOf(_.isUndefined, _.isBoolean),
  publicly_listed: _.isOneOf(_.isUndefined, _.isBoolean),
  published: _.isOneOf(_.isUndefined, _.isBoolean),
  requested_data:  _.isOrganizationRequestedData,
  salesforce: _.isOneOf(_.isUndefined, _.isBoolean),
  state: _.isStringOrNull,
  tag_line: _.isStringOrNull,
  purpose: _.isOrganizationPurpose,
  type: _.isOrganizationType,
  users_can_request_membership: _.isBoolean,
  stripe_email: _.isStringOrNull,
  contact_email: _.isStringOrNull,
  contact_mobile: _.isStringOrNull,
  orgs_subscribed_to_order: _.isArray,
  signing_public_key: _.isString,
  encrypting_public_key: _.isString,
  short_description: _.isString,
});
