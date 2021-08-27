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

import { v4 } from 'uuid';
export let uuid = v4

import compareFactory from './compare'
let _compareByValue = compareFactory(Object)

/**
 * compare
 * @param obj1 {Object}
 * @param obj2 {Object}
 */
export function compareObj(obj1, obj2) {
  if (Object.is(obj1, obj2)) {
    return true
  } else {
    return _compareByValue(obj1, obj2)
  }
}

import { nanoid } from 'nanoid'

import _JSON5 from 'json5'

import * as ramda from 'ramda'
/**
 *
 */
export let R = ramda

import _to from 'await-to-js'

/**
 * to
 * @type {<T, U=Error>(promise: Promise<T>, errorExt?: object) => Promise<[U, undefined] | [null, T]>}
 */
export let awaitTo = _to

/**
 * JSON5
 * @type {JSON}
 */
export let JSON5 = _JSON5

import _comHelper from './comHelper.js'
/**
 * comHelper
 * @type {{autoVal: function({obj: *, key?: *, base?: *, computedVal?: *}=): void}}
 */
export let comHelper = _comHelper

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
 * getImportURL
 * @param url {string}
 * @returns {string}
 */
export function getImportURL(url) {
  return new URL(import.meta.url)
}

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


import _sleep from 'sleep-promise'

/**
 * 睡眠
 */
export let sleep = _sleep

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

/**
 * buildAsyncpipe
 * @returns {function(*=): T}
 */
export function buildAsyncpipe() {
  const steps = Array.from(arguments);
  return function asyncpipe(arg) {
    return steps.reduce(function(result, nextStep) {
      return result.then(nextStep);
    }, Promise.resolve(arg));
  };
}

/**
 * importJsStr
 * @param content
 * @returns {Promise<*>}
 */
export function importJsStr(content) {
  const objectURL = URL.createObjectURL(
    new Blob([content],
      { type: 'text/javascript' })
  );
  return import(objectURL)
}


let _U = {}
/**
 * objArr2OptionsManager
 * @param arrObj {[{}]}
 * @param labelKey
 * @param valueKey
 */
_U.objArr2OptionsManager = function(arrObj = [], labelKey, valueKey) {
  let ret = {}
  ret.origin = arrObj
  ret.options = _lodash.map(arrObj, (item) => {
    return {
      label: item[labelKey],
      value: item[valueKey],
    }
  }) ?? []
  ret.find = function(...args) {
    return _lodash.find(arrObj, ...args)
  }
  return ret
}

/**
 * awaitAxios
 * @param p {Promise}
 * @returns {Promise<{data, err: *, response: *}>}
 */
_U.awaitAxios = async function(p) {
  let [err,response] = await ZY.awaitTo(
    p
  )
  return {
    data: response.data ?? null,
    err,
    response,
  }
}

export let U = _U
