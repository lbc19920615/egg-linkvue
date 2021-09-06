import "./chunk-WGBKWIX4.js";

// node_modules/browser-fs-access/dist/fs-access/file-save.mjs
var file_save_default = async (e, t = [{}], i = null, a = false) => {
  Array.isArray(t) || (t = [t]), t[0].fileName = t[0].fileName || "Untitled";
  const c = [];
  if (t.forEach((t2, i2) => {
    c[i2] = { description: t2.description || "", accept: {} }, t2.mimeTypes ? (i2 === 0 && t2.mimeTypes.push(e.type), t2.mimeTypes.map((e2) => {
      c[i2].accept[e2] = t2.extensions || [];
    })) : c[i2].accept[e.type] = t2.extensions || [];
  }), i)
    try {
      await i.getFile();
    } catch (e2) {
      if (i = null, a)
        throw e2;
    }
  const s = i || await window.showSaveFilePicker({ suggestedName: t[0].fileName, id: t[0].id, startIn: t[0].startIn, types: c, excludeAcceptAllOption: t[0].excludeAcceptAllOption || false }), l = await s.createWritable();
  return await l.write(e), await l.close(), s;
};
export {
  file_save_default as default
};
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
