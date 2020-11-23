'use strict';

const ORGANIZATION_TYPES_LABELS = require('../organization_types_labels');
const ORGANIZATION_TYPES_BY_PURPOSE = require('../organization_types_by_purpose');

describe('ORGANIZATION_TYPES_BY_PURPOSE', function(){
  it('should only contain valid types', function(){
    Object.values(ORGANIZATION_TYPES_BY_PURPOSE).forEach(types => {
      types.forEach(type => {
        expect(ORGANIZATION_TYPES_LABELS[type]).to.exist;
      });
    });
  });
});
