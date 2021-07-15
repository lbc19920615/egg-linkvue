/**
 * Pants module.
 * @module main
 */

// import each from 'lodash/each';

import _req from './ts/fetchio.ts';
export const fetchreq = _req;

import * as _formModel from './formmodel';
import * as _time from './time';
export const Time = _time;

/**
 * formModel
 */
export const formModel = _formModel;

import getGlobalThisPolyfill from 'globalthis/polyfill';

/**
 * global
 * @type {NodeJS.Global}
 */
export const global = getGlobalThisPolyfill();

/**
 * camel
 * @param camel { string } 驼峰格式转为dash格式
 * @return {*}
 */
export function camel2hyphen(camel) {
  return camel.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

/**
 * camelNameToCls
 * @param camel { string } 驼峰格式的字符串
 * @return {*}
 */
export function camelNameToCls(camel) {
  const v = camel2hyphen(camel);
  if (v.startsWith('-')) {
    return v.slice(1);
  }
  return v;
}
