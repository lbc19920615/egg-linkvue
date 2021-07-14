/**
 * Pants module.
 * @module main
 */

// import each from 'lodash/each';

import * as _formModel from './formmodel';
export const formModel = _formModel;

/**
 * camel
 * @param camel
 * @returns {*}
 */
export function camel2hyphen(camel) {
  return camel.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

/**
 * camelNameToCls
 * @param camel
 * @returns {*}
 */
export function camelNameToCls(camel) {
  const v = camel2hyphen(camel);
  if (v.startsWith('-')) {
    return v.slice(1);
  }
  return v;
}
