import "./chunk-WGBKWIX4.js";

// node_modules/browser-fs-access/dist/legacy/directory-open.mjs
var directory_open_default = async (e = [{}]) => (Array.isArray(e) || (e = [e]), e[0].recursive = e[0].recursive || false, new Promise((t, r) => {
  const i = document.createElement("input");
  let n;
  i.type = "file", i.webkitdirectory = true;
  const c = () => n(r);
  e[0].setupLegacyCleanupAndRejection && (n = e[0].setupLegacyCleanupAndRejection(c)), i.addEventListener("change", () => {
    typeof n == "function" && n();
    let r2 = Array.from(i.files);
    e[0].recursive || (r2 = r2.filter((e2) => e2.webkitRelativePath.split("/").length === 2)), t(r2);
  }), i.click();
}));
export {
  directory_open_default as default
};
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
