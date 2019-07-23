'use strict';

const PERSONAL_DATA_KEYS = require('../personal_data_keys');
const CSV_PERSONAL_DATA_MAP = require('../csv_personal_data_map');

describe('csv_personal_data_map', function() {
  it('keys should match PERSONAL_DATA_KEYS', function() {
    expect(Object.keys(CSV_PERSONAL_DATA_MAP).sort()).to.deep.equal([...PERSONAL_DATA_KEYS].sort());
  });
});
