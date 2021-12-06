import _lodashget from 'lodash/get';

const getGlobal = function() {
  // if (typeof self !== 'undefined') { return self; }
  // eslint-disable-next-line no-undef
  if (typeof globalThis !== 'undefined') { return globalThis; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

const nanoid = (size = 21) => {
  let id = '';
  const bytes = new Uint8Array(size);
  getGlobal().crypto.getRandomValues(bytes);

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    // eslint-disable-next-line no-bitwise
    const byte = bytes[size] & 63;
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36);
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte < 63) {
      id += '_';
    } else {
      id += '-';
    }
  }
  return id;
};

/**
 * lodash
 * @type {_.LoDashStatic | _}
 */
export const lodash = {
  get: _lodashget,
};

/**
 * @description nanoid
 * @link https://www.npmjs.com/package/nanoid
 * @type {(size?: number) => string}
 */
export const nid = nanoid;

/**
 * isNumeric
 * @param n
 * @return {boolean}
 */
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * rid
 * @param args
 * @return {string}
 */
export function rid(...args) {
  let v = nid(...args);
  if (isNumeric(v[0]) || v[0] === '-' || v[0] === '_') {
    v = rid(...args);
  }
  return v.replace(/-/g, '_');
}

import _JSON5 from 'json5';
/**
 * JSON5
 * @type {JSON}
 */
export const JSON5 = _JSON5;

/**
 *
 * @param pathArr {string[]}
 * @return {string}
 */
export function getObjPathFromPathArr(pathArr = []) {
  let path = '';
  pathArr.forEach((item, index) => {
    if (index < 1) {
      path = item;
    } else {
      if (typeof item === 'string') {
        path = `${path}['${item}']`;
      } else {
        path = `${path}[${item}]`;
      }
    }
  });
  return path;
}

/**
 *
 * @param pathArr {string[]}
 * @return {string}
 */
export function getObjParentPathFromPathArr(pathArr = []) {
  if (pathArr.length > 1) {
    const ps = pathArr.slice(0, pathArr.length - 1);
    return getObjPathFromPathArr(ps);
  }
  // else if (patharr.length === 1) {
  //   return ''
  // }

  return '';

}


/**
 * deepGet
 * @param target
 * @param path
 * @param defaultVal
 */
export function deepGet(target, path = '', defaultVal) {
  if (!path) {
    return target;
  }
  return _lodashget(target, path, defaultVal);
}


import * as _time from './time';
/**
 * Time类
 * @type {{formatDateTime?: function(Date, string=): *}}
 */
export const Time = _time;

/**
 * 获取here doc
 * @param fn
 * @returns {string}
 */
export function getHereDoc(fn) {
  return fn.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}
