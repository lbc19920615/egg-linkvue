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

import Res from "date-timeout-interval"; // TypeScript
export let Timeout = Res.Timeout
export let Interval = Res.Interval

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

/**
 * isNumeric
 * @param n
 * @returns {boolean}
 */
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * rid
 * @param args
 * @returns {string}
 */
export function rid(...args) {
  let v = nid(...args)
  if (isNumeric(v[0]) || v[0] === '-' || v[0] === '_') {
    v = rid(...args)
  }
  return v.replace(/-/g, '_')
}

// import _PubSub from 'pubsub-js'
/**
 * PubSub
 * @description 文件发布订阅
 * @link https://www.npmjs.com/package/PubSub
 * @type {{}}
 */
// export let PubSub = _PubSub

/**
 * 获取here doc
 * @param fn
 * @returns {string}
 */
export function getHereDoc(fn) {
  return fn.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}

/**
 *
 * @param pathArr {string[]}
 * @returns {string}
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
 * @returns {string}
 */
export function getObjParentPathFromPathArr(pathArr = []) {
  if (pathArr.length > 1) {
    let ps = pathArr.slice(0, pathArr.length - 1)
    return getObjPathFromPathArr(ps)
  }
  // else if (patharr.length === 1) {
  //   return ''
  // }
  else {
    return ''
  }
}

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

/**
 * deepGet
 * @param target
 * @param path
 * @param defaultVal
 */
export function deepGet(target, path = '', defaultVal) {
  if (!path) {
    return target
  }
  return lodash.get(target, path, defaultVal)
}

/**
 * getStrFromObj
 * @param obj
 * @param path
 * @param defaultVal
 * @returns {*}
 */
export function getStrFromObj(obj, path, defaultVal) {
  let v = lodash.get(obj, path)
  if (!v) {
    return defaultVal
  }
  return v
}

/**
 * defaultStr
 * @param v
 * @param defaultVal
 * @returns {*}
 */
export function defaultStr(v, defaultVal) {
  if (!v) {
    return defaultVal
  }
  return v
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

import * as _time from './time';


import APP_UTILS from '../app/core/utils';
export let attr2Str = APP_UTILS.attr2Str

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

// /**
//  * fetchContentV2
//  * @param queryObj {{}}
//  * @param params {{}}
//  * @returns {Promise<any>}
//  */
// export function fetchContentV2 (queryObj = {}, params = {}) {
//   let query = qs.stringify(queryObj)
//   return fetchreq('/getcontentv2?' + query, {
//     baseUrl: REMOTE_ORIGIN,
//     ...params
//   })
// }

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
 *
 * @param obj
 */
export function rmObjProps(obj = {}) {
  _lodash.each(obj, function (item, key) {
    Reflect.deleteProperty(obj, key)
  })
}

/**
 *
 * @param obj {{}}
 * @param parent {string}
 * @param path {string}
 */
export function rmPropByPath(obj, parent, path) {
  if (_lodash.has(obj, parent)) {
    return Reflect.deleteProperty(_lodash.get(obj, parent), path)
  }
  return false
}

/**
 * initTemplate
 * @param id
 * @param document
 * @param html
 * @returns {Promise<void>}
 */
export async function initTemplate(id, document, { html = '' } = {}) {
  if (!document.getElementById(id)) {
    try {
      const template = document.createElement('template');
      template.innerHTML = html;
      template.id = id;
      document.body.appendChild(template);
    } catch (e) {
      console.error(new Error('loadTwigComponent failed'));
    }
  } else {
    //
  }
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

export { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';

export * as PinYin from './pingyin';

import createHtmlElement from 'create-html-element';
/**
 * createEle
 * @type {(options?: Options) => string}
 */
export let createEle = createHtmlElement

/**
 * AsyncFunction
 */
export const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;


let _DOM = {}
_DOM.getAllPropKeys = function() {
  return Object.keys(getComputedStyle(document.body))
    .filter(v => {
      return Number.isNaN(parseInt(v))
    })
    .map(v => {
      let kebase = lodash.kebabCase(v)
      // return {
      //   label: kebase,
      //   value: kebase
      // }
      return kebase
    })
}

export let DOM = _DOM


let _BOM = {}
/**
 * createWindowManager
 * @param url
 * @param target
 * @param options
 */
_BOM.createWindowManager = function(
  {url = '', target = 'PromoteFirefoxWindowName'},

) {

  let windowObjectReference = null; // global variable

  let defaultOptions = {
    width: 800,
    height: 600,
  }

  function openFFPromotionPopup(  options = {}) {

    let op = Object.assign(defaultOptions, options)

    let str = ''
    for (let [key, value] of Object.entries(op)) {
      str = str + `${key}=${value},`
    }

    // console.log('str', str)

    if(windowObjectReference == null || windowObjectReference.closed)
      /* if the pointer to the window object in memory does not exist
         or if such pointer exists but the window was closed */

    {
      windowObjectReference = window.open(url,
        target, str + "resizable,scrollbars,status");
      /* then create it. The new window will be created and
         will be brought on top of any other window. */
    }
    else
    {
      windowObjectReference.focus();
      /* else the window reference must exist and the window
         is not closed; therefore, we can bring it back on top of any other
         window with the focus() method. There would be no need to re-create
         the window or to reload the referenced resource. */
    }
  }

  return {
    open: openFFPromotionPopup,
    getReference() {
      return windowObjectReference
    }
  }
}
export let BOM = _BOM

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

/**
 * scrollToView
 * @param sel {string|HTMLElement}
 * @param options
 */
_U.scrollToView = function(sel, options = {
  behavior: "smooth",
}) {
  if (typeof sel === 'string') {
    document.querySelector(sel).scrollIntoView(options)
  }
  if (sel instanceof HTMLElement) {
    sel.scrollIntoView(options)
  }
}

export let U = _U
