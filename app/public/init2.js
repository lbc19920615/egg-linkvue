globalThis.importScripts = function (p = '') {
  return import(p)
}
