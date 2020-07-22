'use strict';

module.exports = function isLegalEntity(type){
  return (
    type !== 'informal_organization' &&
    type !== 'individual_thought_leader'
  );
};
