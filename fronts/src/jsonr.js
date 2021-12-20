/**
 * @module jsonr
 * @description 基于[JSON5](https://json5.org/)的加强json解析器
 * <p>可以解析function</p>
 */

import JSON5 from 'json5';

// The object
// var obj = {
//   a: 5,
//   b: function (param) {
//     return param;
//   }
// };

// Convert to JSON using a replacer function to output
// the string version of a function with /Function(
// in front and )/ at the end.

/**
 * @example var obj = {
 *   a: 5,
 *   b: function (param) {
 *     return param;
 *   }
 * };
 * const json = JSON.stringify(obj)
 *
 * @param obj {{}}
 * @return {string}
 */
export function stringify(obj = {}) {
  return JSON5.stringify(obj, function(key, value) {
    if (typeof value === 'function') {
      return '/Function(' + value.toString() + ')/';
    }
    return value;
  });
}

// Convert to an object using a reviver function that
// recognizes the /Function(...)/ value and converts it
// into a function via -shudder- `eval`.
// const obj2 = JSON.parse(json, function(key, value) {
//   if (typeof value === 'string' &&
//     value.startsWith('/Function(') &&
//     value.endsWith(')/')) {
//     value = value.substring(10, value.length - 2);
//     return (0, eval)('(' + value + ')');
//   }
//   return value;
// });

/**
 * parse
 * @param json {string}
 * @return {any}
 */
export function parse(json = '') {
  return JSON5.parse(json, function(key, value) {
    if (typeof value === 'string' &&
      value.startsWith('/Function(') &&
      value.endsWith(')/')) {
      value = value.substring(10, value.length - 2);
      // eslint-disable-next-line no-eval
      return (0, eval)('(' + value + ')');
    }
    return value;
  });
}
// document.body.innerHTML = obj2.b(42);
