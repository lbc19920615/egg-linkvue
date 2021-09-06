import "./chunk-WGBKWIX4.js";

// node_modules/browser-fs-access/dist/fs-access/directory-open.mjs
var e = async (t, r, a = t.name) => {
  const i = [], n = [];
  for await (const s of t.values()) {
    const o = `${a}/${s.name}`;
    s.kind === "file" ? n.push(s.getFile().then((e2) => (e2.directoryHandle = t, Object.defineProperty(e2, "webkitRelativePath", { configurable: true, enumerable: true, get: () => o })))) : s.kind === "directory" && r && i.push(e(s, r, o));
  }
  return [...(await Promise.all(i)).flat(), ...await Promise.all(n)];
};
var directory_open_default = async (t = {}) => {
  t.recursive = t.recursive || false;
  const r = await window.showDirectoryPicker({ id: t.id, startIn: t.startIn });
  return e(r, t.recursive);
};
export {
  directory_open_default as default
};
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
