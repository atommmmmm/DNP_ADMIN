/**
 * ||||||||||||||||||||||||||||||||||||
 *  NOTE: Use `import _ from "lodash"`
 *  whenever possible.
 * ||||||||||||||||||||||||||||||||||||
 */

/**
 * Ease way to assert styles in an obj
 * @param {Object} obj = { address: "0x12345" }
 * @param {Object} referenceTypes = { address: "0x" }
 * @param {String} id: to make errors more comprehensive
 */
export function assertObjTypes(obj, referenceTypes, id = "Obj") {
  Object.keys(referenceTypes).forEach(key => {
    if (!sameType(obj[key], referenceTypes[key])) {
      throw Error(
        `${id} prop ${key} must be like ${referenceTypes[key]} (${typeOf(
          referenceTypes[key]
        )}), instead is: ${obj[key]} (${typeOf(obj[key])})`
      );
    }
  });
}

/**
 * @param {Array} array of objects: [ {id: 1}, {id: 2} ]
 * @param {Function} key: Can be:
 * 1. The key of the item to become the id
 * 2. Function to get the id from each item: (item) => item.id
 * @return {Object} resulting object: { 1: {id: 1}, 2: {id: 2} }
 */
export const arrayToObj = (array, key) => {
  if (typeof key === "string") {
    // 1. The key of the item to become the id
    return array.reduce((obj, item) => {
      return { ...obj, [item[key]]: item };
    }, {});
  } else if (typeof key === "function") {
    // 2. Function to get the id from each item: (item) => item.id
    return array.reduce((obj, item) => {
      return { ...obj, [key(item)]: item };
    }, {});
  } else {
    throw Error("key must be a string or function");
  }
};

/**
 * Safe version of JSON.stringify. On error returns an error string
 * @param {Object} obj
 */
export function stringifyObjSafe(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return `Error stringifying: ${e.message}`;
  }
}

/**
 * Keeps the unique items of an array of objects.
 * To compare equality, stringifies the item and compares the strings
 * @param {Array} array
 * @returns {Array} uniqueArray
 */
export const uniqueArrayOfObjects = array =>
  [...new Set(array.map(o => JSON.stringify(o)))].map(o => JSON.parse(o));

/**
 * Immutable clean of empty values
 * @param {Object} obj
 * @returns {Object}
 */
export function cleanObj(obj) {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      // delete obj[key];
    } else {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

// Utilities (of this util)

/**
 * Compares types while differentiating arrays from objects
 * @param {Any} a
 * @param {Any} b
 */
const sameType = (a, b) => typeOf(a) === typeOf(b);
const typeOf = a => (Array.isArray(a) ? "array" : typeof a);
