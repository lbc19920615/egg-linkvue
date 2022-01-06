/**
 * Pants module.
 * @module ext
 */

import _eval5 from 'eval5';
import _JSON5 from 'json5';
import * as _JSON7 from './jsonr';

import { formatDateTime } from './time';
import _local from 'localforage';
import _fileUtils from 'file-saver';
import * as _FS from 'browser-fs-access';
import _cssObj from 'cssobj';
import _marked from 'marked';

/**
 * 判断是否是在electron 环境
 * @return {boolean}
 */
export function isElectron() {
  // return false
  // Renderer process
  // eslint-disable-next-line no-undef
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    return true;
  }

  // Main process
  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  // eslint-disable-next-line no-undef
  if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;
}


// eslint-disable-next-line no-unused-vars
function electronSave(blob, {
  fileName,
  // eslint-disable-next-line no-unused-vars
  extensions,
}) {
  return new Promise(resolve => {
    const fs = global.require('fs');
    const remote = global.require('electron').remote;
    // console.log(fs);
    remote.dialog.showSaveDialog({
      title: '另存为',
      defaultPath: fileName,
      // properties: ['openFile', 'openDirectory']
    })
      .then(result => {
        // console.dir(result);
        if (!result.canceled) {
          fs.writeFileSync(result.filePath, blob);
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
      });
  });
}

/**
 * electronOpen
 * @param options
 * @return {Promise<unknown>}
 */
function electronOpen(options = {}) {
  return new Promise(resolve => {
    const fs = global.require('fs');
    const remote = global.require('electron').remote;
    remote.dialog.showOpenDialog({
      properties: [ 'openFile' ],
      ...options,
    })
      .then(result => {
        // console.log(result.canceled);
        // console.log(result.filePaths);
        if (!result.canceled) {
          if (result.filePaths && result.filePaths[0]) {
            const buffer = fs.readFileSync(result.filePaths[0]);
            // console.log(buffer)
            resolve(new Blob([ buffer ]));
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
}

/**
 * eval5
 * eval5官网 {@link https://www.npmjs.com/package/eval5}
 */
export const eval5 = _eval5;


/**
 * evaluate
 * @param code {string}
 * @param ctx
 */
// eslint-disable-next-line no-undef
export function run(code = '', ctx = {}) {
  return eval5(`
function __main() {
${code}
}
__main();
`, ctx ? ctx : {});
}

/**
 * store 保存数据到本地  indexedDB
 * @type {LocalForage}
 */
export const store = _local;


/**
 * saveAs 保存通过浏览器链接下载
 */
export const saveAs = _fileUtils.saveAs;

/**
 * saveStrAs 保存字符串通过浏览器链接下载
 * @param str
 * @param file
 * @param type
 * @param cls
 * @return {*}
 */
export function saveStrAs(str = '', {
  file = '',
  type = 'text/plain;charset=utf-8',
  cls = Blob,
} = {}) {
  const blob = new cls([ str ], { type });
  return saveAs(blob, file);
}

/**
 * saveObjAsJson5File 存贮js对象为json5文件
 * @param obj
 * @param fileName
 * @param saveFun
 */
export function saveObjAsJson5File(obj = {}, fileName = '', {
  saveFun = saveStrAs,
} = {}) {
  saveFun(_JSON5.stringify(obj), {
    file: fileName + '.json5',
  });
}

/**
 * saveStrUseFS 保存字符串通过FS
 * @param str
 * @param fileName
 * @param cls
 * @param extensions
 * @return {Promise<FileSystemHandle>}
 */
export function saveStrUseFS(str = '', {
  fileName = '',
  cls = Blob,
  extensions = [],
  type = '',
  options = {},
} = {}) {
  const blob = new cls([ str ], { type });
  if (isElectron()) {
    return electronSave(blob, {
      fileName,
      extensions,
      ...options,
    });
  }
  return _FS.fileSave(blob, {
    fileName,
    extensions,
    ...options,
  });
}

/**
 * FS 支持读取和写入本地文件
 * {@link https://www.npmjs.com/package/browser-fs-access}
 */
export const FS = _FS;

/**
 *
 * @param mimeTypes
 * @return {Promise<void>}
 */
export async function fileOpen({ mimeTypes = [] } = {}) {
  let blob = null;
  const options = {
    mimeTypes,
  };

  try {
    if (isElectron()) {
      blob = await electronOpen(options);
    } else {
      blob = await FS.fileOpen(options);
    }
  } catch (e) {
    //
  }
  return blob;
}


/**
 * 读取JSON5文件
 * @param mimeTypes {string[]}
 * @return {Promise<any>}
 */
export async function fileOpenJSON5({ mimeTypes = [] } = {}) {
  let text = '';
  try {
    let blob = null;
    const options = {
      mimeTypes,
    };

    if (isElectron()) {
      blob = await electronOpen(options);
    } else {
      blob = await FS.fileOpen(options);
    }
    if (blob) {
      text = await blob.text();
      try {
        const obj = _JSON5.parse(text);
        return obj;
      } catch (e) {
        return Promise.reject(
          new Error(`fileOpenJSON5 parse err ${e.message}`, {
            cause: e,
          })
        );
      }
    }
  } catch (e) {
    return Promise.reject(
      new Error(`fileOpenJSON5 select err ${e.message}`, {
        cause: e,
      })
    );
  }
}

/**
 * @param data
 * @param fileName
 * @param prefix
 * @param saveFun
 */
export function saveJSONFile({ data = null, fileName = '', prefix = '', saveFun }) {
  const d = new Date();
  const time = formatDateTime(d, 'YYYY-MM-DD__HH');
  saveObjAsJson5File(data, `${prefix}${fileName}_${time}_${d.getTime()}`, {
    saveFun,
  });
}

/**
 * 保存v1版本design file
 * @param data
 * @param fileName
 * @param prefix
 * @param saveFun
 */
export function saveDesignFile({ data = null, fileName = '', prefix = '', saveFun }) {
  const d = new Date();
  const time = formatDateTime(d, 'YYYY-MM-DD__HH');
  const saved = {
    data,
    date: Date.now(),
  };
  saveObjAsJson5File(saved, `${prefix}${fileName}_${time}_${d.getTime()}`, {
    saveFun,
  });
}

/**
 * 读取v1版本design file
 * @param version
 * @return {Promise<*>}
 */
export async function openDesignFile({ version = 'v1' }) {
  const obj = await fileOpenJSON5();
  if (obj && obj.data) {
    return obj.data;
  }
  return Promise.reject(new Error('文件格式不对'));
}

/**
 * cssObj
 * 官网 {@link https://www.npmjs.com/package/cssobj}
 * @type {CssObj.Static}
 */
export const cssObj = _cssObj;

/**
 * marked
 * 官网 {@link https://www.npmjs.com/package/marked}
 */
export const marked = _marked;

/**
 * JSON7
 * 支持解析函数的JSON5
 */
export const JSON7 = _JSON7;


import _cssobj from 'cssobj';
export const cssobj = _cssobj;


/**
 * 比较版本号大小 兼容微信版本号
 * @param v1
 * @param v2
 * @return {number}
 */
export function compareLibVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);
  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}
