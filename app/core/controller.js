const lodash = require('lodash');

const { Controller } = require('egg');
const { getPropField } = require('./form2');

function getStrIfIsNotEmpty(obj, path, defaultVal) {
  const v = lodash.get(obj, path);
  if (!v) {
    return defaultVal;
  }
  return v;
}

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
    // console.log('attrs', attrs, str);
  }
  return str;
}

/**
 *
 * @param p
 * @param k
 */
function buildCls(p, k = 'ui.class') {
  const cls = lodash.get(p, k);
  let str = '';
  if (Array.isArray(cls)) {
    str = cls.join(' ');
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
      const fromPath = getSelfPath(basePath, append.BASE_PATH);
      context.tpl = context.tpl + `
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', selfpath: '${fromPath}',  process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
            name="object_prev"></slot-com>
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
      const array_con_tag = p.con_tag ? p.con_tag : 'el-col';
      const con_attr = attrStr(p, 'ui.conAttrs', {
        itemKey,
        indexKey,
      });
      const con_cls = buildCls(p, 'ui.conClass');
      context.tpl = context.tpl + `
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', selfpath: '${fromPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="array_prev"></slot-com>
<${array_tag} class="level_${level} z-form__array ${buildCls(p)}" ${attrStr(p)}>
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', selfpath: '${fromPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="array_before"></slot-com>
<${array_con_tag} v-for="(${itemKey}, ${indexKey}) in ${basePath}" class="z-form__array-con ${con_cls}" ${con_attr}>
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
        const col_tag = p.tag ? p.tag : 'div';
        const field_tag = p.field_tag ? p.field_tag : 'cm-field';
        const fromPath = getSelfPath(basePath, append.BASE_PATH);
        context.tpl = context.tpl + `
<${col_tag} class="level_${level} z-form__prop" ${attrStr(p)}
>`;
        context.tpl = context.tpl +
          `
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', selfpath: '${fromPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="prop_before"></slot-com>
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

function buildTableColumns(p, basePath, configPath, append = {}) {
  const context = {
    tpl: '',
  };

  const { records, page, limit } = p.properties;

  if (records && records.type === 'array') {
    // const recordModelPath = `${basePath}.records`;
    const recordConfigPath = `${configPath}.properties.records.items.properties`;
    const recordProperties = records.items.properties;
    // console.log('properties', recordProperties);
    for (const [ recordKey ] of Object.entries(recordProperties)) {
      const columnConfigPath = `${recordConfigPath}.${recordKey}`;
      context.tpl = context.tpl + `<el-table-column prop="${recordKey}" 
:label="z_get(${columnConfigPath}, 'ui.label', '${recordKey}')" 
v-bind="get(${columnConfigPath}, 'ui.widgetConfig')"
></el-table-column>`;
    }
  }
  return context.tpl;
}

function buildTableActions(p, basePath, configPath, append = {}) {
  const context = {
    tpl: '',
  };

  const { actions = {} } = p.properties;
  console.log('actions', p.properties, actions);
  if (actions && actions.type === 'object') {
    // const recordModelPath = `${basePath}.actions`;
    const recordConfigPath = `${configPath}.properties.actions.properties`;
    const recordProperties = actions.properties;
    // console.log('properties', recordProperties);
    const actionsChildren = Object.entries(recordProperties);
    if (actionsChildren.length > 0) {
      context.tpl = context.tpl + `
      <el-table-column label="操作"><template #default="scope">
`;
      for (const [ recordKey ] of Object.entries(recordProperties)) {
        const columnConfigPath = `${recordConfigPath}.${recordKey}`;
        context.tpl = context.tpl + `
        <el-button v-bind="get(${columnConfigPath}, 'ui.widgetConfig')" @click="callPageEvent(get(${columnConfigPath}, 'ui.widgetConfig.eventName'), { key: '${recordKey}', partName: '${append.part.name}', parts, process: '${append.CONFIG.process}' }, $event)">
${recordKey} </el-button>
        `;
      }
      context.tpl = context.tpl + '</template></el-table-column>';
    }

    // for (const [ recordKey ] of Object.entries(recordProperties)) {
    //   const columnConfigPath = `${recordConfigPath}.${recordKey}`;
    // }
  }
  return context.tpl;
}

function renderForm2(p, basePath, configPath, append = {}) {
  const context = {
    tpl: '',
  };
  function render(p, key, context, level, basePath, configPath, pathArrStr, ext) {
    if (p.type === 'object') {
      const obj_tag = p.tag ? p.tag : 'view';
      context.tpl = context.tpl + `
<${obj_tag} class="level_${level} z-form__object" ${attrStr(p)}
v-if="${basePath}" 
>`;
      for (const [ key, value ] of Object.entries(p.properties)) {
        ext.parentModel = `${basePath}`;
        render(value, key, context, level + 1,
          `${basePath}.${key}`, `${configPath}.properties.${key}`, `${pathArrStr},'${key}'`, ext);
      }
      context.tpl = context.tpl + `
</${obj_tag}>`;
    } else if (p.type === 'array') {
      const itemKey = 'item' + level;
      const indexKey = 'index' + level;
      // const fromPath = getSelfPath(basePath, append.BASE_PATH);
      const array_tag = p.tag ? p.tag : 'z-collection';
      const array_con_tag = p.con_tag ? p.con_tag : 'block';
      const con_attr = attrStr(p, 'ui.conAttrs', {
        itemKey,
        indexKey,
      });
      const con_cls = buildCls(p, 'ui.conClass');
      context.tpl = context.tpl + `
<${array_tag} class="level_${level} z-form__array ${buildCls(p)}" ${attrStr(p)}
  @add="onAdd([${append.BASE_FORM_KEY} ${pathArrStr}], $event)"
>
    <${array_con_tag} v-for="(${itemKey}, ${indexKey}) in ${basePath}" 
    class="z-form__array-con ${con_cls}" ${con_attr}
>`;
      if (p.items.type === 'object') {
        for (const [ key, value ] of Object.entries(p.items.properties)) {
          ext.parentModel = `${basePath}[${indexKey}]`;
          render(value, key, context, level + 1,
            `${basePath}[${indexKey}].${key}`, `${configPath}.items.properties.${key}`,
            `${pathArrStr}, ${indexKey}, '${key}'`, ext);
        }
      }
      context.tpl = context.tpl + `
    </${array_con_tag}>
</${array_tag}>`;
    } else {
      // console.log(p, key);
      if (!p.hidden) {
        const col_tag = p.tag ? p.tag : 'view';
        const field_tag = getStrIfIsNotEmpty(p, 'ui.widget', 'van-field');
        // const fromPath = getSelfPath(basePath, append.BASE_PATH);
        // console.log(pathArrStr, append.BASE_FORM_KEY);
        context.tpl = context.tpl + `
<${col_tag} class="level_${level} z-form__prop" ${attrStr(p)}
>`;

        //   prop="${key}"
        //   form-path="${basePath}"
        // :parent-model="${ext.parentModel}"
        //   type="${p.type}"
        // :ui="${configPath}.ui"
        // :rules="${configPath}.rules"
        // :context="${append.partKey}"
        //   part_key="${append.partKey}"
        //         context.tpl = context.tpl +
        //           `
        // <${field_tag}
        // v-model="${basePath}"
        // label="${key}"
        // @change="onSetProp([${append.BASE_FORM_KEY} ${pathArrStr}], $event)">
        // </${field_tag}>`;

        const propFieldStr = getPropField(p, basePath, key, pathArrStr, append);

        context.tpl = context.tpl + propFieldStr;

        context.tpl = context.tpl + `
</${col_tag}>`;
      } else {
        //
      }
    }
  }

  render(p, '', context, 1, basePath, configPath, '', { arrIndexes: {} });
  return context.tpl;
}

class BaseController extends Controller {
  // eslint-disable-next-line no-useless-constructor
  constructor(ctx) {
    super(ctx);
  }
  BASE_renderForm(config, basePath, configPath, append) {
    append.BASE_PATH = basePath;
    return renderForm(config, basePath, configPath, append);
  }
  BASE_renderForm2(config, basePath, configPath, append) {
    append.BASE_PATH = basePath;
    return renderForm2(config, basePath, configPath, append);
  }
  BASE_renderTable(config, basePath, configPath, append) {
    append.BASE_PATH = basePath;

    // <el-table
    // :data="${basePath}"
    //   >${buildTableColumns(config, basePath, configPath, append)}</el-table>
    // console.log('config', config)
    const configStr = `
    <section>${configPath}</section>
    `;
    // ${basePath}
    // {{${basePath}}}
    // ${configStr}
    // {{${configPath}}}

    return `
    <el-table
    :data="get(${basePath}, 'records', [])"
      >${buildTableColumns(config, basePath, configPath, append)}${buildTableActions(config, basePath, configPath, append)}</el-table>
    `.trim();
  }
}

module.exports = BaseController;
