'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

function createSecret(length = sodium.crypto_secretbox_NONCEBYTES){
  if (typeof length !== 'number')
    throw new Error('length must be of type number');
  const buffer = Buffer.alloc(length);
  sodium.randombytes(buffer, length);
  return b64.encode(buffer);
}

function createCrypto(encodedKey){
  const key = b64.decode(encodedKey);

  function encrypt(item, secret){
    return b64.encode(
      sodium.crypto_secretbox(
        b64.decode(item),
        b64.decode(secret),
        key,
      )
    );
  }

  function decrypt(encryptedItem, secret){
    const buffer = sodium.crypto_secretbox_open(
      b64.decode(encryptedItem),
      b64.decode(secret),
      key,
    );
    return buffer ? b64.encode(buffer) : undefined;
  }

  function encryptString(string, secret){
    return encrypt(b64.encode(Buffer.from(string)), secret);
  }

  function decryptString(encryptString, secret){
    return b64.decode(decrypt(encryptString, secret)).toString();
  }

  return {
    encrypt,
    decrypt,
    encryptString,
    decryptString,
  };
};

module.exports = {
  createSecret,
  createCrypto,
};
