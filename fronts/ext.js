import _eval5 from 'eval5';
import _JSON5 from 'json5';

/**
 * eval5
 * @type {(code: string, ctx?: (VMContext | undefined), options?: (ScriptOptions | undefined)) => any}
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

import _local from 'localforage';

/**
 * store
 * @type {LocalForage}
 */
export const store = _local;


import _fileUtils from 'file-saver';

/**
 * saveAs
 */
export const saveAs = _fileUtils.saveAs;

/**
 * saveStrAs
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
 * 存贮js对象为json5文件
 * @param obj
 */
export function saveObjAsJson5File(obj = {}, fileName) {
  saveStrAs(_JSON5.stringify(obj), {
    file: fileName + '.json5',
  });
}
