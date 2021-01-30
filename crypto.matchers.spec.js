'use strict';

const {
  testPatternWithoutOptions,
  notStrings,
  notObjects,
  randomObjects,
} = require('./test/helpers');

require('./crypto.matchers');

describe('crypto.matchers', function(){

  testPatternWithoutOptions(
    'aCryptoSignKeypair',
    [
      {
        publicKey: 'sPn-epr17DsTMRtvJi4Ol-m0LhaqacaOCfM4H55Wn0M',
        privateKey: '7rI5Nu3lCE_Ewwn62Q0JwSTaxUGKTCpYRVRQzl08Rkqw-f56mvXsOxMxG28mLg6X6bQuFqppxo4J8zgfnlafQw',
      }
    ],
    [
      {},
      {
        publicKey: '',
        privateKey: '',
      },
      {
        publicKey: 'SPB1T4BwvSYm5xkMEbpXdrhBOa8fGHUoCrie6tboxFM',
        privateKey: 'ffmrWZ9GqXfyVDRuW6IsQ33D0fAcFdXD-zlM2gaI5Vo',
      },
      ...notStrings(),
      ...notObjects(),
      ...randomObjects(),
    ],
  );

});
