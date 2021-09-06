import "./chunk-WGBKWIX4.js";

// node_modules/browser-fs-access/dist/fs-access/file-open.mjs
var e = async (e2) => {
  const t = await e2.getFile();
  return t.handle = e2, t;
};
var file_open_default = async (t = [{}]) => {
  Array.isArray(t) || (t = [t]);
  const i = [];
  t.forEach((e2, t2) => {
    i[t2] = { description: e2.description || "", accept: {} }, e2.mimeTypes ? e2.mimeTypes.map((c2) => {
      i[t2].accept[c2] = e2.extensions || [];
    }) : i[t2].accept["*/*"] = e2.extensions || [];
  });
  const c = await window.showOpenFilePicker({ id: t[0].id, startIn: t[0].startIn, types: i, multiple: t[0].multiple || false, excludeAcceptAllOption: t[0].excludeAcceptAllOption || false }), a = await Promise.all(c.map(e));
  return t[0].multiple ? a : a[0];
};
export {
  file_open_default as default
};
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
