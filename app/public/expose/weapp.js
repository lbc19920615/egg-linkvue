import {
  require_lodash
} from "./chunks/chunk-KKIPYUKB.js";
import {
  __toModule
} from "./chunks/chunk-WGBKWIX4.js";

// fronts/weapp.js
var import_lodash = __toModule(require_lodash());
var nanoid = (size = 21) => {
  let id = "";
  const bytes = global.crypto.getRandomValues(new Uint8Array(size));
  while (size--) {
    const byte = bytes[size] & 63;
    if (byte < 36) {
      id += byte.toString(36);
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte < 63) {
      id += "_";
    } else {
      id += "-";
    }
  }
  return id;
};
var lodash = import_lodash.default;
var nid = nanoid;
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function rid(...args) {
  let v = nid(...args);
  if (isNumeric(v[0]) || v[0] === "-" || v[0] === "_") {
    v = rid(...args);
  }
  return v.replace(/-/g, "_");
}
export {
  isNumeric,
  lodash,
  nid,
  rid
};
