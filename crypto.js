'use strict';

const sodium = require('sodium-native');
const b64 = require('urlsafe-base64');

function createSecret(length = sodium.crypto_secretbox_NONCEBYTES){
  if (typeof length !== 'number')
    throw new Error('length must be of type number');
  const buffer = Buffer.alloc(length);
  sodium.randombytes_buf(buffer);
  return b64.encode(buffer);
}

function createCrypto(encodedKey){
  const key = b64.decode(encodedKey);

  function encrypt(message, secret){
    message = b64.decode(message);
    const ciphertext = Buffer.alloc(message.length + sodium.crypto_secretbox_MACBYTES);
    sodium.crypto_secretbox_easy(
      ciphertext,
      message,
      b64.decode(secret),
      key,
    );
    const fixed = Buffer.concat([Buffer.alloc(sodium.crypto_secretbox_MACBYTES), ciphertext]);
    return b64.encode(fixed);
  }

  function decrypt(ciphertext, secret){
    ciphertext = b64.decode(ciphertext).slice(sodium.crypto_secretbox_MACBYTES);
    const decrypted = Buffer.alloc(ciphertext.length - sodium.crypto_secretbox_MACBYTES);
    const good = sodium.crypto_secretbox_open_easy(
      decrypted,
      ciphertext,
      b64.decode(secret),
      key,
    );
    if (good) return b64.encode(decrypted);
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

function signString(stringToSign, privateKey){
  const bufferToSign = Buffer.from(stringToSign, 'utf8');
  const signature = Buffer.alloc(bufferToSign.length + sodium.crypto_sign_BYTES);
  sodium.crypto_sign(
    signature,
    bufferToSign,
    b64.decode(privateKey),
  );
  return signature;
}

function verifySignedString(signature, publicKey){
  const message = Buffer.alloc(signature.length - sodium.crypto_sign_BYTES);
  const good = sodium.crypto_sign_open(
    message,
    signature,
    b64.decode(publicKey)
  );
  return good ? message.toString() : null;
}

module.exports = {
  createSecret,
  createCrypto,
  signString,
  verifySignedString,
};
