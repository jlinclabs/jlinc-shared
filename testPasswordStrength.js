'use strict';

const owaspPasswordStrengthTest = require('owasp-password-strength-test');

owaspPasswordStrengthTest.config({
  minLength: 8,
  minOptionalTestsToPass: 4,
});

module.exports = function testPasswordStrength(password) {
  const strengthTestResult = owaspPasswordStrengthTest.test(password);
  let firstError = strengthTestResult.errors[0];
  if (!firstError) return;
  firstError = firstError.replace(/^The password/, 'Password');
  if (firstError === 'Password must contain at least one special character.') {
    return `Password must contain one of the following special characters: !"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~`;
  }
  return firstError;
};
