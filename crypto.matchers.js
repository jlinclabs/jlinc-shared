'use strict';

const { signString, verifySignedString } = require('./crypto.js');

const { expect, definePattern } = require('./test/matchers');

definePattern('aPublicKey', /.+/);

definePattern('aPrivateKey', /.+/);

definePattern('aCryptoSignKeypair', (keys) => {
  expect(keys).to.matchPattern({
    publicKey: _.isPublicKey,
    privateKey: _.isPrivateKey,
  });
  const { publicKey, privateKey } = keys;
  const itemToSign = `${Math.random()} is my favorite number`;
  let decoded;
  try{
    decoded = verifySignedString(
      signString(itemToSign, privateKey),
      publicKey
    );
  }catch(error){
    expect.fail(true, false, `libsodium error: ${error}`);
  }
  expect(decoded).to.equal(itemToSign);
});

