import _eval5 from 'eval5';
import _JSON5 from 'json5';

import { formatDateTime } from './time';
import _local from 'localforage';
import _fileUtils from 'file-saver';
import * as _FS from 'browser-fs-access';
import _cssObj from 'cssobj';
import _marked from 'marked';


// eslint-disable-next-line no-unused-vars
function electronSave(blob, {
  fileName,
  // eslint-disable-next-line no-unused-vars
  extensions,
}) {
  return new Promise(resolve => {
    const fs = global.require2('fs');
    // console.log(fs);
    global.electronRemote.dialog.showSaveDialog({
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

/**
 * store
 * @type {LocalForage}
 */
export const store = _local;


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
 * saveStrUseFS
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
  if (global.require2) {
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
 * FS
 * @type {{FileWithDirectoryHandle: FileWithDirectoryHandle, FirstCoreFileOptions: FirstCoreFileOptions, FileWithHandle: FileWithHandle, CoreFileOptions: CoreFileOptions, FileSystemHandle: FileSystemHandle, FirstFileOpenOptions: FirstFileOpenOptions, supported: boolean, imageToBlob: (img: HTMLImageElement) => Promise<Blob>, FirstFileSaveOptions: FirstFileSaveOptions, FileSystemHandlePermissionDescriptor: FileSystemHandlePermissionDescriptor, directoryOpen: (options?: {recursive: boolean, startIn?: WellKnownDirectory | FileSystemHandle, id?: string, setupLegacyCleanupAndRejection?: (rejectionHandler?: () => void) => (reject: (reason?: any) => void) => void}) => Promise<FileWithDirectoryHandle[]>, fileSave: (blob: Blob, options?: ([FirstFileSaveOptions, ...CoreFileOptions[]] | FirstFileSaveOptions), existingHandle?: (FileSystemHandle | null), throwIfExistingHandleNotGood?: boolean) => Promise<FileSystemHandle>, WellKnownDirectory: "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos", fileOpen: <M=false extends boolean | undefined>(options?: ([FirstFileOpenOptions<M>, ...CoreFileOptions[]] | FirstFileOpenOptions<M>)) => M extends (false | undefined) ? Promise<FileWithHandle> : Promise<FileWithHandle[]>}}
 */
export const FS = _FS;

/**
 * 读取JSON5文件
 * @param mimeTypes {string[]}
 * @return {Promise<any>}
 */
export async function fileOpenJSON5({ mimeTypes = [] } = {}) {
  let text = '';
  try {
    const blob = await FS.fileOpen({
      mimeTypes,
    });
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
      new Error('fileOpenJSON5 select err', {
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
 * @type {CssObj.Static}
 */
export const cssObj = _cssObj;

/**
 * marked
 * @type {(function(*=, *=, *=): (*|undefined|string))|*}
 */
export const marked = _marked;
