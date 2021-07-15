var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/globalthis/implementation.browser.js
var require_implementation_browser = __commonJS({
  "node_modules/globalthis/implementation.browser.js"(exports, module) {
    "use strict";
    if (typeof self !== "undefined") {
      module.exports = self;
    } else if (typeof window !== "undefined") {
      module.exports = window;
    } else {
      module.exports = Function("return this")();
    }
  }
});

// node_modules/globalthis/polyfill.js
var require_polyfill = __commonJS({
  "node_modules/globalthis/polyfill.js"(exports, module) {
    "use strict";
    var implementation = require_implementation_browser();
    module.exports = function getPolyfill() {
      if (typeof global !== "object" || !global || global.Math !== Math || global.Array !== Array) {
        return implementation;
      }
      return global;
    };
  }
});

// fronts/formmodel.js
var formmodel_exports = {};
__export(formmodel_exports, {
  createFormModel: () => createFormModel
});
function initFormBase(def = { type: "" }) {
  if (def.type === "object") {
    return {};
  }
  if (def.type === "array") {
    return [];
  }
  return null;
}
function formSchemaToObject(formDef, obj) {
  if (formDef.type === "object") {
    Object.entries(formDef.properties).forEach(([key, formDefProp]) => {
      if (formDefProp.type !== "array") {
        obj[key] = null;
      } else {
        obj[key] = [void 0];
        obj[key][0] = initFormBase(formDefProp.items);
        formSchemaToObject(formDefProp.items, obj[key][0]);
      }
    });
  }
}
function createFormModel(formDef) {
  let obj;
  obj = initFormBase(formDef);
  formSchemaToObject(formDef, obj);
  return obj;
}

// fronts/main.js
var import_polyfill = __toModule(require_polyfill());
var formModel = formmodel_exports;
var global2 = (0, import_polyfill.default)();
function camel2hyphen(camel) {
  return camel.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
function camelNameToCls(camel) {
  const v = camel2hyphen(camel);
  if (v.startsWith("-")) {
    return v.slice(1);
  }
  return v;
}
export {
  camel2hyphen,
  camelNameToCls,
  formModel,
  global2 as global
};
