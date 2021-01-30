'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

const { chai, expect, definePattern } = require('./test/matchers');

definePattern('aPublicKey', /.+/);

definePattern('aPrivateKey', /.+/);

definePattern('aCryptoSignKeypair', (keys) => {
  expect(keys).to.matchPattern({
    publicKey: _.isPublicKey,
    privateKey: _.isPrivateKey,
  });
  const { publicKey, privateKey } = keys;
  const itemToSign = `${Math.random()} is my favorite number`;
  try{
    expect(
      sodium.crypto_sign_open(
        sodium.crypto_sign(
          Buffer.from(itemToSign, 'utf8'),
          b64.decode(privateKey),
        ),
        b64.decode(publicKey)
      ).toString()
    ).to.equal(itemToSign);
  }catch(error){
    if (error instanceof chai.AssertionError) throw error;
    expect.fail(true, false, `linsodium error: ${error}`);
  }
});

