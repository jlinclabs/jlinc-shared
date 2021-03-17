'use strict';

const regExpEscape = require('escape-string-regexp');

const { definePattern } = require('./test/matchers');

definePattern('anAssetUrl', target => {
  let url = module.exports.ASSETS_SERVER_URL;
  if (typeof url !== 'string' || url === '')
    throw new Error('you must set ASSETS_SERVER_URL before using jlinc-shared/assets.matchers');
  url = url.replace(/\/*$/, '/'); // normalize trailing slash
  // https://assets.jlinc.io/d9967350-e88d-11ea-9977-1fe4b7062307.jpg
  const regexp = new RegExp(`^${regExpEscape(url)}[^\\/]+\\.\\w{2,5}$`);
  expect(target).to.match(regexp);
});

// NOTE: This matcher requires that you set
module.exports.ASSETS_SERVER_URL;
