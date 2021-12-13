/**
 * Pants module.
 * @module main
 */

import getGlobalThisPolyfill from 'globalthis/polyfill';
import { v4 } from 'uuid';
import compareFactory from './compare';
import Res from 'date-timeout-interval'; // TypeScript
import { nanoid } from 'nanoid';

import _JSON5 from 'json5';

import * as ramda from 'ramda';
import _to from 'await-to-js';
import _comHelper from './comHelper.js';
import _Lock from 'js-lock';
import _lodash from 'lodash';
import _qs from 'qs';
import * as _time from './time';


import APP_UTILS from './utils';
import * as _formModel from './formmodel';
import _sleep from 'sleep-promise';
import createHtmlElement from 'create-html-element';

/**
 * global
 * 全局globalThis
 * @type {NodeJS.Global}
 */
export const global = getGlobalThisPolyfill();

/**
 * uuid v4
 * 官网 {@link https://www.npmjs.com/package/uuid}
 */
export let uuid = v4

/**
 * _compareByValue
 * @private
 */
let _compareByValue = compareFactory(Object)

/**
 * compareObj
 * 比较两个对象大小
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

/**
 * Timeout 安全的setTimeout 避免浏览器静止问题
 * @type {Timeout}
 */
export let Timeout = Res.Timeout

/**
 * Interval 安全的setInterval 避免浏览器静止问题
 * @type {Timeout}
 */
export let Interval = Res.Interval

/**
 * ramda
 * 官网 {@link https://www.npmjs.com/package/ramda}
 */
export let R = ramda

/**
 * awaitTo
 * 方便async捕获错误 避免多次编写try catch
 * 官网 {@link https://www.npmjs.com/package/await-to-js}
 */
export let awaitTo = _to

/**
 * JSON5
 * @type {JSON}
 */
export let JSON5 = _JSON5

/**
 * comHelper
 * 只在编辑使用
 * @deprecated
 */
export let comHelper = _comHelper

/**
 * nid
 * 官网 {@link https://www.npmjs.com/package/nanoid}
 */
export let nid = nanoid

/**
 * isNumeric 判断是否是像数字
 * @param n {any}
 * @returns {boolean}
 */
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * random id
 * @param args {Array}
 * @returns {string}
 */
export function rid(...args) {
  let v = nid(...args)
  if (isNumeric(v[0]) || v[0] === '-' || v[0] === '_') {
    v = rid(...args)
  }
  return v.replace(/-/g, '_')
}

/**
 * cid
 * kebabCase 风格的 random id
 * @param args {Array}
 * @returns {string}
 */
export function cid(...args) {
  return _lodash.kebabCase(rid(...args))
}


/**
 * 获取here doc
 * @param fn
 * @returns {string}
 */
export function getHereDoc(fn) {
  return fn.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}

/**
 * getObjPathFromPathArr
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
 * getObjParentPathFromPathArr
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

/**
 * Lock
 * {@link https://www.npmjs.com/package/js-lock}
 * @type {Lock}
 */
export let Lock = _Lock

/**
 * lodash
 * @type {_.LoDashStatic}
 */
export let lodash = _lodash

/**
 * deepGet
 * 类似于lodash get 但当path不存在直接返回target 并不去使用默认值
 * @param target {Object}
 * @param path {string | Array<String>}
 * @param defaultVal  {any}
 */
export function deepGet(target, path = '', defaultVal) {
  if (!path) {
    return target
  }
  return lodash.get(target, path, defaultVal)
}

/**
 * getStrFromObj
 * @param obj {Object}
 * @param path {string | Array<String>}
 * @param defaultVal {Any}
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

/**
 * qs
 * {@link https://www.npmjs.com/package/qs}
 * @type {QueryString}
 */
export const qs = _qs;

// import _req from './ts/fetchio.ts';
/**
 * attr2Str
 * @deprecated
 */
export let attr2Str = APP_UTILS.attr2Str

/**
 * UTILS
 */
export let UTILS = APP_UTILS

/**
 * Time类
 */
export const Time = _time;

/**
 * CSS
 * @type {{parseObj(*): void}}
 */
export const CSS = {
  parseObj(style,  {split = ';', pasedKey = _lodash.kebabCase, pasedValue = function(v) {return v}}) {
    return Object.entries(style).map(([k, v]) => `${pasedKey(k)}:${pasedValue(v)}`).join(split)
  }
};

/**
 * formModel
 */
export const formModel = _formModel;

let _url = new URL(import.meta.url)
/**
 * REMOTE_ORIGIN 获取改js的import meta url
 * @deprecated
 * @type {string}
 */
export const REMOTE_ORIGIN = _url.origin

/**
 * getImportURL 获取改js的import meta url
 * @param url {string}
 * @returns {string}
 */
export function getImportURL(url) {
  return new URL(import.meta.url)
}

/**
 * fetchContentV3
 * @deprecated
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
 * 睡眠
 * 在async方法里 让当前线程等待几秒
 */
export let sleep = _sleep

/**
 * camel 驼峰格式转为dash格式
 * @param camel { string }
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
 * rmObjProps 删除对象所有可见属性
 * @param obj {{}}
 */
export function rmObjProps(obj = {}) {
  _lodash.each(obj, function (item, key) {
    Reflect.deleteProperty(obj, key)
  })
}

/**
 * rmPropByPath 通过path删除对象属性
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
 *
 * @param id
 * @param document
 * @param html
 * @private
 */

function _initTemplate(id, document, { html = '' } = {}) {
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
 * initTemplate  生成template标签
 * @deprecated

 */
export let initTemplate = _initTemplate

/**
 * buildAsyncPipe
 */
export function buildAsyncPipe() {
  const steps = Array.from(arguments);
  return function asyncpipe(arg) {
    return steps.reduce(function(result, nextStep) {
      return result.then(nextStep);
    }, Promise.resolve(arg));
  };
}

/**
 * structuralClone 深克隆
 * @param obj {{}}
 * @returns {Promise<unknown>}
 */
export function structuralClone(obj = {}) {
  return new Promise(resolve => {
    const {port1, port2} = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

/**
 * importJsStr 通过string执行js
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

/**
 * deep-object-diff
 * {@link https://www.npmjs.com/package/js-lock}
 * {@link }
 */
export { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';

// export * as PinYin from './pingyin';
/**
 * createEle
 */
export let createEle = createHtmlElement

/**
 * AsyncFunction
 */
export const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;


let _DOM = {}
/**
 * getAllPropKeys
 * @param el { HTMLElement }
 * @returns []
 */
_DOM.getAllPropKeys = function(el = document.body) {
  return Object.keys(getComputedStyle(el))
    .filter(v => {
      return Number.isNaN(parseInt(v))
    })
    .map(v => {
      // return {
      //   label: kebase,
      //   value: kebase
      // }
      return lodash.kebabCase(v)
    });
}
/**
 * 初始化template
 * @type {_initTemplate}
 */
_DOM.initTemplate = _initTemplate

export let DOM = _DOM


let _BOM = {}
/**
 * createWindowManager 创建一个window 窗口
 * @param url {string}
 * @param target {string}
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
 * @param arrObj {Array<Object>}
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
  }) ?? [];
  ret.find = function(...args) {
    return _lodash.find(arrObj, ...args)
  }
  return ret
}

/**
 * awaitAxios
 * @param p {Promise}
 * @returns {Promise}
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
