'use strict';

const jsonwebtoken = require('jsonwebtoken');
const {
  testPatternWithoutOptions,
  testPatternWithOptions,
  randomObjects,
} = require('../helpers');
require('./jwt');

const toJWT = value => jsonwebtoken.sign(value, 'x');
describe('matchers/jwt', function(){

  testPatternWithoutOptions(
    'aJWT',
    [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    ],
    ['', ...randomObjects()],
  );

  testPatternWithOptions(
    'aJWTMatchingPattern',
    [
      [
        {name: _.isString, size: _.isNumber},
        [
          toJWT({name: 'Jared', size: 12}),
          toJWT({name: '', size: 0}),
          toJWT({name: '', size: 0, iat: 1607726220}),
        ],
        [
          // ...randomObjects(),
          toJWT({}),
          toJWT({name: '', size: null}),
        ],
      ],
      [
        {name: _.isString, size: _.isNumber},
        [
          toJWT({name: 'Jared', size: 12, iat: 1607726220}),
          toJWT({name: '', size: 0}),
        ],
        [
          // ...randomObjects(),
          toJWT({}),
          toJWT({name: '', size: null}),
        ],
      ],
    ]
  );

});
