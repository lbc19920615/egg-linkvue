/**
 * Pants module.
 * @module main
 */

import getGlobalThisPolyfill from 'globalthis/polyfill';
/**
 * global
 * @type {NodeJS.Global}
 */
export const global = getGlobalThisPolyfill();


import { nanoid } from 'nanoid'

/**
 * @description nanoid
 * @link https://www.npmjs.com/package/nanoid
 * @type {(size?: number) => string}
 */
export let nid = nanoid

import _PubSub from 'pubsub-js'
/**
 * PubSub
 * @description 文件发布订阅
 * @link https://www.npmjs.com/package/PubSub
 * @type {{}}
 */
export let PubSub = _PubSub

import _Lock from 'js-lock'
/**
 * Lock
 * @description 文件锁
 * @link https://www.npmjs.com/package/js-lock
 * @type {Lock}
 */
export let Lock = _Lock

import _lodash from 'lodash';

/**
 * lodash
 * @type {_.LoDashStatic | _}
 */
export let lodash = _lodash

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

import * as _time from './time';

/**
 * Time类
 * @type {{formatDateTime?: function(Date, string=): *}}
 */
export const Time = _time;


import * as _formModel from './formmodel';
/**
 * formModel
 */
export const formModel = _formModel;

let url = new URL(import.meta.url)
/**
 * REMOTE_ORIGIN
 * @type {string}
 */
export const REMOTE_ORIGIN = url.origin

/**
 * fetchContentV2
 * @param queryObj {{}}
 * @param params {{}}
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
 * fetchContentV3
 * @param data {{}}
 * @param query {{}}
 * @returns {Promise<any>}
 */
export function fetchContentV3 (data = {}, query = {}) {
  let url = '/getcontentv3'
  if (Object.keys(query).length > 0) {
    url = url + '?' + qs.stringify(query)
  }
  return fetchreq(url, {
    baseUrl: REMOTE_ORIGIN,
    method: 'POST',
    body: data
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
