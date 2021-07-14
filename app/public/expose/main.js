var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
var formModel = formmodel_exports;
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
  formModel
};
