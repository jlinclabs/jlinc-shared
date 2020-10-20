'use strict';

module.exports = function setNullOrFalseToUndefined(object){
  for (const key in object)
    if (object[key] === null || object[key] === false)
      object[key] = undefined;
  return object;
};
