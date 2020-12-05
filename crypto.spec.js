'use strict';

const b64 = require('urlsafe-base64');

const {
  createSecret,
  createCrypto,
} = require('./crypto');

describe('lib/crypto', function() {

  describe('createSecret', function() {
    it('should create a b64 encoded random string', function(){
      expect(() => createSecret({})).to.throw('length must be of type number');
      expect(createSecret(8) ).to.be.a('string').and.have.lengthOf(11);
      expect(createSecret(12)).to.be.a('string').and.have.lengthOf(16);
      expect(createSecret(16)).to.be.a('string').and.have.lengthOf(22);
      expect(createSecret(24)).to.be.a('string').and.have.lengthOf(32);
      expect(createSecret(32)).to.be.a('string').and.have.lengthOf(43);

      const secrets = [];
      Array(100).forEach(() => {
        const newSecret = createSecret(8);
        expect(secrets).to.not.include(newSecret);
        secrets.push(newSecret);
      });
    });
  });

  describe('encrypt and decrypt', function() {
    let encrypt;
    let decrypt;
    let encryptString;
    let decryptString;
    beforeEach(function(){
      ({
        encrypt,
        decrypt,
        encryptString,
        decryptString,
      } = createCrypto(createSecret(32)));
    });

    describe('encrypt and decrypt', function() {
      it('should encrypt and decrypt', function(){
        const secret = createSecret();
        const message = `the time is ${Date.now()}`;
        const encodedMessage = b64.encode(Buffer.from(message));

        const encryptedMessage = encrypt(encodedMessage, secret);
        expect(encryptedMessage).to.be.a('string');
        expect(encryptedMessage).to.not.equal(message);

        expect(decrypt(encryptedMessage, createSecret())).to.be.undefined;

        const decryptedMessage = decrypt(encryptedMessage, secret);
        expect(decryptedMessage).to.equal(encodedMessage);
        expect(b64.decode(decryptedMessage).toString()).to.equal(message);
      });

      it('should be able to handle JSON strings', function(){
        const secret = createSecret();
        const data = {
          some: 'json',
          size: 45,
          alive: true,
          nested: { things: [5,'p',[1]] },
        };
        const json = JSON.stringify(data);
        const encryptedJson = encrypt(b64.encode(Buffer.from(json)), secret);
        const decryptedJson = b64.decode(decrypt(encryptedJson, secret)).toString();
        expect(decryptedJson).to.equal(json);
        expect(JSON.parse(decryptedJson)).to.deep.equal(data);
      });
    });

    describe('encryptString and decryptString', function() {
      it('should encrypt and decrypt', function(){
        const secret = createSecret();
        const string = `some random test string ${Date.now()}`;
        expect(decryptString(encryptString(string, secret), secret)).to.equal(string);
      });
      it('should be able to handle JSON strings', function(){
        const secret = createSecret();
        const data = {
          some: 'json',
          size: 45,
          alive: true,
          nested: { things: [5,'p',[1]]},
        };
        const json = JSON.stringify(data);
        const encryptedJson = encryptString(json, secret);
        const decryptedJson = decryptString(encryptedJson, secret);
        expect(decryptedJson).to.equal(json);
        expect(JSON.parse(decryptedJson)).to.deep.equal(data);
      });
    });
  });
});
