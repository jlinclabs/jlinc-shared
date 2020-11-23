'use strict';

const chai = require('chai');
const chaiMatchPattern = require('chai-match-pattern');

require('sinon');

chai.use(require('sinon-chai'));
chai.use(chaiMatchPattern);

global.expect = chai.expect;
global._ = chaiMatchPattern.getLodashModule();
