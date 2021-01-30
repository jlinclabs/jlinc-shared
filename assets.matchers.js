'use strict';

const regExpEscape = require('escape-string-regexp');

const { definePattern } = require('./test/matchers');
require('./assets.matchers');

// NOTE: This matcher requires that you set
module.exports.ASSETS_SERVER_URL = 'http://fake-assets.test:8081';

definePattern('anAssetUrl', target => {
  let url = module.exports.ASSETS_SERVER_URL;
  if (!url) console.warn( // eslint-disable-line no-console
    'assets.matchers requires you set variables.ASSETS_SERVER_URL'
  );
  url = url.replace(/\/*$/, '/'); // normalize trailing slash
  // https://assets.jlinc.io/d9967350-e88d-11ea-9977-1fe4b7062307.jpg
  const regexp = new RegExp(`^${regExpEscape(url)}[^\\/]+\\.\\w{2,5}$`);
  expect(target).to.match(regexp);
});


