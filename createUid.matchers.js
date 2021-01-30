'use strict';

const { definePattern } = require('./test/matchers');

definePattern('aUID', /^[a-z0-9]{32}$/);
