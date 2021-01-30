'use strict';

require('sinon');
require('sinon-chai');
const { chai } = require('./matchers');
chai.use(require('sinon-chai'));

function withSinon(){
  beforeEach(function(){
    if (this.sinon)
      throw new Error('Does this test call withSinon twice?');
    this.sinon = sinon.sandbox.create();
  });
  afterEach(function() {
    this.sinon.restore();
    delete this.sinon;
  });
};


module.exports = {
  withSinon,
};
