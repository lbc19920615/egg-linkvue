function isNull(value) {
  return value === null;
}

/**
 * formmodel
 * @module formmodel
 */

/**
 * initFormBase
 * @description 初始化form base
 * @param def {{ type: '' }}
 */
function initFormBase(def = { type: '' }) {
  if (def.type === 'object') {
    return {};
  }
  if (def.type === 'array' || def.type === Array) {
    return [];
  }
  return null;
}

const ARRAY_TYPES = [ 'checkbox' ];

export function defDefault(type, formDefProp) {
  // console.log('formDefProp.type', formDefProp.type)
  let defaultFun;
  if (Array.isArray(formDefProp.default) && formDefProp.default.length > 1) {
    // eslint-disable-next-line no-new-func
    defaultFun = new Function(formDefProp.default[0], formDefProp.default[1]);
    return defaultFun({});
  }
  if (ARRAY_TYPES.includes(type)) {
    return [];
  }
  // if (isNull(type)) {
  //   return null;
  // }
  return undefined;
}

/**
 * 通过formschema递归生成object
 * @param formDef {{}}
 * @param obj {{}}
 */
function formSchemaToObject(formDef, obj) {
  // console.log('formDef', formDef)
  if (formDef.type === 'object') {
    Object.entries(formDef.properties).forEach(([ key, formDefProp ]) => {
      // console.log('formDefProp', formDefProp)
      if (formDefProp.type !== 'array') {
        obj[key] = defDefault(formDefProp.type, formDefProp);
      } else {
        // obj[key] = [ undefined ];
        // if (formDefProp.items.type === 'object') {
        //   obj[key][0] = {}
        // }
        // obj[key][0] = initFormBase(formDefProp.items);

        obj[key] = [ ];

        // formSchemaToObject(formDefProp.items, obj[key][0]);
      }
    });
  }
}

/**
 * 通过formDef生成model
 * {@link https://ncform.github.io/ncform/ncform-show/playground/index.html#tpl=basic-verification-rule}
 * @deprecated
 * @param formDef {{}}
 * @returns {any}
 */
export function createFormModel(formDef) {
  let obj;
  // eslint-disable-next-line prefer-const
  obj = initFormBase(formDef);
  formSchemaToObject(formDef, obj);
  return obj;
}

/**
 * 通过formDef生成model
 * @param formDef
 * @returns {{}}
 */
export function create(formDef) {
  let obj;
  // eslint-disable-next-line prefer-const
  obj = initFormBase(formDef);
  formSchemaToObject(formDef, obj);
  return obj;
}
