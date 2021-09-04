import "./chunk-WGBKWIX4.js";

// node_modules/browser-fs-access/dist/legacy/file-open.mjs
var file_open_default = async (e = [{}]) => (Array.isArray(e) || (e = [e]), new Promise((n, t) => {
  const i = document.createElement("input");
  i.type = "file";
  const c = [...e.map((e2) => e2.mimeTypes || []).join(), e.map((e2) => e2.extensions || []).join()].join();
  let a;
  i.multiple = e[0].multiple || false, i.accept = c || "";
  const l = () => a(t);
  e[0].setupLegacyCleanupAndRejection && (a = e[0].setupLegacyCleanupAndRejection(l)), i.addEventListener("change", () => {
    typeof a == "function" && a(), n(i.multiple ? Array.from(i.files) : i.files[0]);
  }), i.click();
}));
export {
  file_open_default as default
};
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
