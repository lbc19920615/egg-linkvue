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
  if (def.type === 'array') {
    return [];
  }
  return null;
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
      if (formDefProp.type !== 'array') {
        obj[key] = null;
      } else {
        obj[key] = [ undefined ];
        // if (formDefProp.items.type === 'object') {
        //   obj[key][0] = {}
        // }
        obj[key][0] = initFormBase(formDefProp.items);

        formSchemaToObject(formDefProp.items, obj[key][0]);
      }
    });
  }
}

/**
 * 通过formDef生成model
 * @link https://ncform.github.io/ncform/ncform-show/playground/index.html#tpl=basic-verification-rule
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
