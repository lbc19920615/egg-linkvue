const lodash = require('lodash');

function getSelfPath(basePath, BASE_PATH) {
  let fromPath = basePath.replace(BASE_PATH, '');
  if (fromPath.startsWith('.')) {
    fromPath = fromPath.slice(1, fromPath.length);
  }
  return fromPath;
}

/**
 * attrStr
 * @param p {{}}  config
 * @param k {string} key
 * @param context
 * @return {string}
 */
function attrStr(p, k = 'ui.attrs', context = {}) {
  const c = Object.assign({
    $: lodash,
  }, context);
  let str = '';
  const attrs = lodash.get(p, k);
  if (Array.isArray(attrs)) {
    attrs.forEach(attr => {
      if (Array.isArray(attr)) {
        str = str + ` ${attr[0]}='${attr[1]}'`;
      } else if (typeof attr === 'string') {
        str = str + ` ${attr}`;
      } else if (lodash.isObject(attr) && Array.isArray(attr.handler)) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(attr.handler[0], attr.handler[1]);
        const ret = fun(c);
        if (Array.isArray(ret)) {
          str = str + ` ${ret[0]}='${attr.prefixValue ? attr.prefixValue : ''}${ret[1]}${attr.suffixValue ? attr.suffixValue : ''}'`;
        }
      }
    });
    console.log('attrs', attrs, str);
  }
  return str;
}

function renderForm(p, basePath, configPath, append = {}) {
  const context = {
    tpl: '',
  };
  function render(p, key, context, level, basePath, configPath, ext) {
    if (p.type === 'object') {
      const obj_tag = p.tag ? p.tag : 'el-row';
      context.tpl = context.tpl + `
<${obj_tag} class="level_${level} z-form__object" ${attrStr(p)}
v-if="${basePath}"
>`;
      for (const [ key, value ] of Object.entries(p.properties)) {
        ext.parentModel = `${basePath}`;
        render(value, key, context, level + 1,
          `${basePath}.${key}`, `${configPath}.properties.${key}`, ext);
      }
      context.tpl = context.tpl + `
</${obj_tag}>`;
    } else if (p.type === 'array') {
      const itemKey = 'item' + level;
      const indexKey = 'index' + level;
      const fromPath = getSelfPath(basePath, append.BASE_PATH);
      const array_tag = p.tag ? p.tag : 'el-row';
      const array_con_tag = p.con_tag ? p.con_tag : 'el-row';
      const con_attr = attrStr(p, 'ui.conAttrs', {
        itemKey,
        indexKey,
      });
      context.tpl = context.tpl + `
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', selfpath: '${fromPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="array_prev"></slot-com>
<${array_tag} class="level_${level} z-form__array" ${attrStr(p)}>
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', selfpath: '${fromPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="array_before"></slot-com>
<${array_con_tag} v-for="(${itemKey}, ${indexKey}) in ${basePath}" class="z-form__array-con" ${con_attr}>
<slot-com :defs="slotContent" :attrs="{parts}"
         :binds="{key: '${key}', partName: '${append.part.name}', indexKey:${indexKey}, fromPath: '${fromPath}', selfpath: '${fromPath}['+ ${indexKey} +']', level:'${level}', parentlevel:'${level - 1}', basePath: '${basePath}', configPath: '${configPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
            name="array_item_before"></slot-com>
`;
      if (p.items.type === 'object') {
        for (const [ key, value ] of Object.entries(p.items.properties)) {
          ext.parentModel = `${basePath}[${indexKey}]`;
          render(value, key, context, level + 1,
            `${basePath}[${indexKey}].${key}`, `${configPath}.items.properties.${key}`, ext);
        }
      }
      context.tpl = context.tpl + `
<slot-com :defs="slotContent" :attrs="{parts}"
         :binds="{key: '${key}', partName: '${append.part.name}', indexKey:${indexKey}, fromPath: '${fromPath}', selfpath: '${fromPath}['+ ${indexKey} +']', level:'${level}', parentlevel:'${level - 1}', basePath: '${basePath}', configPath: '${configPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
            name="array_item_after"></slot-com>
</${array_con_tag}>
<slot-com :defs="slotContent" :attrs="{parts}"
         :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
            name="array_after"></slot-com>
</${array_tag}>`;
    } else {
      // console.log(p, key);
      if (!p.hidden) {
        const col_tag = p.tag ? p.tag : 'el-col';
        const field_tag = p.field_tag ? p.field_tag : 'cm-field';
        context.tpl = context.tpl + `
<${col_tag} class="level_${level} z-form__prop" ${attrStr(p)}
>`;
        context.tpl = context.tpl +
          `
<${field_tag}
v-model="${basePath}"
label="${key}" prop="${key}"
form-path="${basePath}"
:parent-model="${ext.parentModel}"
type="${p.type}"
:ui="${configPath}.ui"
:rules="${configPath}.rules"
:context="${append.partKey}"
part_key="${append.partKey}"
>
</${field_tag}>`;
        context.tpl = context.tpl + `
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', type: '${p.type}', partName: '${append.part.name}', level:'${level}', parentlevel:'${level - 1}', basePath: '${basePath}', configPath: '${configPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="prop_after"></slot-com>
</${col_tag}>`;
      } else {
      //
      }
    }
  }

  render(p, '', context, 1, basePath, configPath, { arrIndexes: {} });
  return context.tpl;
}

const { Controller } = require('egg');
class BaseController extends Controller {
  // eslint-disable-next-line no-useless-constructor
  constructor(ctx) {
    super(ctx);
  }
  BASE_renderForm(config, basePath, configPath, append) {
    append.BASE_PATH = basePath;
    return renderForm(config, basePath, configPath, append);
  }
}

module.exports = BaseController;
