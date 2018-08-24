'use strict';

module.exports = function testPasswordStrength(password) {
  if (password.length < 12) {
    return 'Passphrase must be at least 12 characters.';
  }
};
