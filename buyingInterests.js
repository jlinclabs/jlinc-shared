'use strict';

const DATE_STRING = /^\d\d\d\d-\d\d-\d\d$/;
const VALID_CURRENCIES = Object.freeze(['$', '€', '£', '¥']);

// this is designed to take a record from postgres and normalize it
function normalizeBuyingInterest(buyingInterest){
  return {
    uid: nullToUndefined(buyingInterest.uid),
    type: nullToUndefined(buyingInterest.type),
    organization_apikey: nullToUndefined(buyingInterest.organization_apikey),
    description: nullToUndefined(buyingInterest.description),
    location: nullToUndefined(buyingInterest.location),
    price_low: nullToUndefined(buyingInterest.price_low),
    price_high: nullToUndefined(buyingInterest.price_high),
    beginning_date: dateToString(buyingInterest.beginning_date),
    end_date: dateToString(buyingInterest.end_date),
    industry: nullToUndefined(buyingInterest.industry),
    currency: nullToUndefined(buyingInterest.currency),
    brands: buyingInterest.brands ? Array.from(buyingInterest.brands) : [],
    tags: buyingInterest.tags ? Array.from(buyingInterest.tags) : [],
    created: nullToUndefined(buyingInterest.created),
  };
}

function nullToUndefined(value){
  return value === null ? undefined : value;
}

function dateToString(date){
  return date instanceof Date
    ? `${date.getFullYear()}-${zp(date.getUTCMonth() + 1)}-${zp(date.getUTCDate())}`
    : undefined;
}

const zp = n => n.toString().length === 1 ? `0${n}` : n;

// this function is designed to be used on the a-api and b-api to validate
// the object posted to the server to create a buying interest
function validateBuyingInterest(buyingInterest){
  if (!buyingInterest) throw new Error(`buyingInterest required`);

  if (typeof buyingInterest !== 'object') {
    throw new Error(`buyingInterest must be an object`);
  }

  const {
    description,
    currency,
    price_low,
    price_high,
    beginning_date,
    end_date,
    location,
    brands,
    tags,
  } = buyingInterest;

  if (typeof description !== 'string') throw new Error(`Description cannot be blank`);

  if (description.length < 10) throw new Error(`Description must at least 10 characaters long`);

  if (!VALID_CURRENCIES.includes(currency)) {
    throw new Error(`Currency must be one of ${VALID_CURRENCIES.join(',')}`);
  }

  if (!Array.isArray(tags)) throw new Error(`Tags must be an array`);
  if (!isArrayOfNonEmptyStrings(tags))
    throw new Error('Tags can only be non-empty strings');

  if (tags.length < 1) throw new Error('At least one tag is required');

  if (typeof price_low !== 'undefined' && (!isInteger(price_low) || price_low < 0))
    throw new Error(`Minimum price must be a positive integer`);

  if (typeof price_high !== 'undefined' && (!isInteger(price_high) || price_high < 0))
    throw new Error(`Maximum price must be a positive integer`);

  if (isInteger(price_low) && isInteger(price_high) && price_low > price_high)
    throw new Error(`Maximum price must be greater than or equal to Minimum price`);

  if (typeof beginning_date !== 'undefined'){
    if (typeof beginning_date !== 'string' || !isDateString(beginning_date))
      throw new Error(`Beginning date must be a valid date string`);
  }

  if (typeof end_date !== 'undefined'){
    if (typeof end_date !== 'string' || !isDateString(end_date))
      throw new Error(`End date must be a valid date string`);
  }

  if (
    typeof beginning_date === 'string' &&
    typeof end_date === 'string' &&
    new Date(end_date) < new Date(beginning_date)
  )
    throw new Error(`End date must greater than or equal to Beginning date`);

  if (typeof location !== 'undefined'){
    if (typeof location !== 'string') throw new Error(`Location must be a string`);
    if (location.length < 4) throw new Error(`Location must be 4 or more characters`);
  }

  if (typeof brands !== 'undefined'){
    if (!Array.isArray(brands)) throw new Error('Brands must be an array');
    if (!isArrayOfNonEmptyStrings(brands))
      throw new Error('Brands can only be non-empty strings');
  }
};

function isInteger(n){
  return typeof n === 'number' && !n.toString().includes('.');
}

function isDateString(date){
  return (
    typeof date === 'string' &&
    date.match(DATE_STRING) &&
    dateToString(new Date(date)) === date
  );
}

function isArrayOfNonEmptyStrings(array){
  return array.every(member => typeof member === 'string' && member.length > 0);
}

module.exports = {
  normalizeBuyingInterest,
  validateBuyingInterest,
};
