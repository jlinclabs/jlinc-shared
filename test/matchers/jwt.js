'use strict';

const jsonwebtoken = require('jsonwebtoken');
const { expect, definePattern } = require('./helpers');

definePattern('aJWT', /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);

definePattern('aJWTMatchingPattern', (jwt, pattern) => {
  expect(jwt).to.be.aJWT();
  const decoded = jsonwebtoken.decode(jwt);
  if (!('iat' in pattern)) delete decoded.iat;
  expect(decoded).to.matchPattern(pattern);
});
