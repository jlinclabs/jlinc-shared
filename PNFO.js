'use strict';

const isDataYogi = require('./isDataYogi');
/*
  PNFO - Public Name For Organization

  We keep changing the public name for organization.
  In the past we've called it
    - organization
    - organisation
    - space
    - node
    - circle
    - group
    - hub
    - connection

  So we've made it a variable
*/

module.exports = Object.freeze(
  isDataYogi
    ? { singular: 'Connection', plural: 'Connections' }
    : { singular: 'Hub', plural: 'Hubs' }
);
