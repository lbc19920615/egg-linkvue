/**
 * Pants module.
 * @module main
 */

import get from 'lodash/get';
export let lodash = {
  get
}

import _qs from 'qs';

/**
 * qs
 * @type {QueryString}
 */
export const qs = _qs;

import _req from './ts/fetchio.ts';

/**
 * fetchreq
 */
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

// console.log(import.meta)
let url = new URL(import.meta.url)
/**
 * REMOTE_ORIGIN
 * @type {string}
 */
export const REMOTE_ORIGIN = url.origin

/**
 * fetchContentV2
 * @param queryObj
 * @param params
 * @returns {Promise<any>}
 */
export function fetchContentV2 (queryObj = {}, params = {}) {
  let query = qs.stringify(queryObj)
  return fetchreq('/getcontentv2?' + query, {
    baseUrl: REMOTE_ORIGIN,
    ...params
  })
}

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
