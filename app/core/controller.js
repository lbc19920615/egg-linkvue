function getSelfPath(basePath, BASE_PATH) {
  let fromPath = basePath.replace(BASE_PATH, '');
  if (fromPath.startsWith('.')) {
    fromPath = fromPath.slice(1, fromPath.length);
  }
  return fromPath;
}

function renderForm(p, basePath, configPath, append = {}) {
  const context = {
    tpl: '',
  };
  function render(p, key, context, level, basePath, configPath, ext) {
    if (p.type === 'object') {
      context.tpl = context.tpl + `
<el-row class="level_${level} z-form__object"
v-if="${basePath}"
>`;
      for (const [ key, value ] of Object.entries(p.properties)) {
        ext.parentModel = `${basePath}`;
        render(value, key, context, level + 1,
          `${basePath}.${key}`, `${configPath}.properties.${key}`, ext);
      }
      context.tpl = context.tpl + `
</el-row>`;
    } else if (p.type === 'array') {
      const itemKey = 'item' + level;
      const indexKey = 'index' + level;
      const fromPath = getSelfPath(basePath, append.BASE_PATH);
      context.tpl = context.tpl + `
<el-row class="level_${level} z-form__array">
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', selfpath: '${fromPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="array_before"></slot-com>
<el-row v-for="(${itemKey}, ${indexKey}) in ${basePath}" class="z-form__array-con" >
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
</el-row>
<slot-com :defs="slotContent" :attrs="{parts}"
         :binds="{key: '${key}', partName: '${append.part.name}', configPath: '${configPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
            name="array_after"></slot-com>
</el-row>`;
    } else {
      // console.log(p, key);
      if (!p.hidden) {
        context.tpl = context.tpl + `
<el-col class="level_${level} z-form__prop"
>`;
        context.tpl = context.tpl +
          `
<cm-field
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
</cm-field>`;
        context.tpl = context.tpl + `
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', type: '${p.type}', partName: '${append.part.name}', level:'${level}', parentlevel:'${level - 1}', basePath: '${basePath}', configPath: '${configPath}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="prop_after"></slot-com>
</el-col>`;
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
    const recordModelPath = `${basePath}.records`;


    const recordConfigPath = `${configPath}.properties.records.items.properties`
    const recordProperties = records.items.properties;
    // console.log('properties', recordProperties);
    for (const [ recordKey, recordValue ] of Object.entries(recordProperties)) {
      const columnConfigPath = `${recordConfigPath}.${recordKey}`
      context.tpl = context.tpl + `<el-table-column prop="${recordKey}" 
:label="z_get(${columnConfigPath}, 'ui.label', '${recordKey}')" 
v-bind="get(${columnConfigPath}, 'ui.widgetConfig')"
></el-table-column>`;
    }
  }


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
      >${buildTableColumns(config, basePath, configPath, append)}</el-table>
    `.trim();
  }
}

module.exports = BaseController;
