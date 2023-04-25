'use strict';

const b64 = require('urlsafe-base64');

const {
  createSecret,
  createCrypto,
} = require('./crypto');

describe('crypto', function() {

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
    const secret = 'eZLUEzOYaDMUxDGGvlgmgdRWF8nrPhCyrwczoznH8VA';
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
      } = createCrypto(secret));
    });

    describe('encrypt and decrypt', function() {
      it('should encrypt and decrypt', function(){
        const secret = 'ciMRglkN5c0uo6IeBr9xtjsAc6acy88z';
        const message = `the is some static message`;
        const encodedMessage = b64.encode(Buffer.from(message));
        expect(encodedMessage).to.equal(`dGhlIGlzIHNvbWUgc3RhdGljIG1lc3NhZ2U`);

        const encryptedMessage = encrypt(encodedMessage, secret);
        expect(encryptedMessage).to.equal('AAAAAAAAAAAAAAAAAAAAAL4mdVgMsJxLxWtpmSxlxZy9DR9JKECC2IxjFfJfWb_baiVau5rvOJpiAA');
        expect(encryptedMessage).to.be.a('string');
        expect(encryptedMessage).to.not.equal(message);
        expect(decrypt(encryptedMessage, createSecret())).to.be.undefined;

        const decryptedMessage = decrypt(encryptedMessage, secret);
        expect(decryptedMessage).to.equal(encodedMessage);
        expect(b64.decode(decryptedMessage).toString()).to.equal(message);
      });

      it('should be able to handle JSON strings', function(){
        const secret = 'jfSmabHkulpu0PKGS4mD79efxnsxwHzc';
        const data = {
          some: 'json',
          size: 45,
          alive: true,
          nested: { things: [5,'p',[1]] },
        };
        const json = JSON.stringify(data);
        const encryptedJson = encrypt(b64.encode(Buffer.from(json)), secret);
        expect(encryptedJson).to.equal('AAAAAAAAAAAAAAAAAAAAAMz6dz2jcsgBzUp4xC1kWWO4vR2c557TAUYy5exw5bedY4Cr0SUIW2gtnfIWNuRPXqDVdb5F3kw2fAr5oosGObZ4PG4NDdLgTimvP3l1OQUXRvII-Vnr');
        const decryptedJson = b64.decode(decrypt(encryptedJson, secret)).toString();
        expect(decryptedJson).to.equal(json);
        expect(JSON.parse(decryptedJson)).to.deep.equal(data);
      });


      it('static encrypted values', function(){
        const secret = 'nsQigp8iCpTvb_RH9eZcCJdhLGBgQu3h';
        expect(
          decryptString('AAAAAAAAAAAAAAAAAAAAAHXxgwtGMCPjuN8QPFjW7kqvSQ0pWYreqqOttOqsJ4yMtH5mTYUzoyKa0A', secret)
        ).to.equal('{"victor":{"badass":true}}');
      });
    });

    describe('encryptString and decryptString', function() {
      it('should encrypt and decrypt', function(){
        const secret = '7QpEa2kqTg7T7m-qRRJyO9FBcOw-C44t';
        const string = `some static test string`;
        const encryptedString = encryptString(string, secret);
        expect(encryptedString).to.equal('AAAAAAAAAAAAAAAAAAAAAIlVSz8wHBqapDsktOlWdRQD7SS0zNbLxtB3bOYFJNXyOdTnooXXOg');
        expect(decryptString(encryptedString, secret)).to.equal(string);
      });
      it('should be able to handle JSON strings', function(){
        const secret = 'X9ETsvUyrGTwN97V1oLDuCkRt27vNFjb';
        const data = {
          some: 'json',
          size: 45,
          alive: true,
          nested: { things: [5,'p',[1]]},
        };
        const json = JSON.stringify(data);
        const encryptedJson = encryptString(json, secret);
        expect(encryptedJson).to.equal('AAAAAAAAAAAAAAAAAAAAAGF_ha6z7d1c37HqcGX1ExxBCVhnQzrsObIHzOrOUc_n5JS7sRCTvSI-Wxx6ko2zHSSjMNP8Wag1JopVonQUr-7sjyeoShDFmDyikkqRLk9s-jxXqt4L');
        const decryptedJson = decryptString(encryptedJson, secret);
        expect(decryptedJson).to.equal(json);
        expect(JSON.parse(decryptedJson)).to.deep.equal(data);
      });
      it('static encrypted values', function(){
        const secret = 'kdpsVNaNHP4u7Ksc6gdu9ST9agIB1KVg';
        expect(decryptString('AAAAAAAAAAAAAAAAAAAAAHh8IpF6C7imsXC-SH20HwxXePW6W2Oh-pIPYlHkm5_7VzH1ok_YG5K7xJ-h', secret)).to.equal('jlinc connects all the silos');
        expect(decryptString('AAAAAAAAAAAAAAAAAAAAANbWqXtxClJzpKGs48WpYsVGNuq9Wzet595bfBDyidv7SC737FPPToSv1Q', secret)).to.equal('{"victor":{"badass":true}}');
      });
    });

  });

});
