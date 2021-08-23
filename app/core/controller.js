function renderForm(p, basePath, configPath, append = {}) {
  const context = {
    tpl: '',
  };
  function render(p, key, context, level, basePath, configPath) {
    if (p.type === 'object') {
      context.tpl = context.tpl + `
<el-row class="level_${level} object"
v-if="${basePath}"
>`;
      for (const [ key, value ] of Object.entries(p.properties)) {
        render(value, key, context, level + 1,
          `${basePath}['${key}']`, `${configPath}.properties['${key}']`);
      }
      context.tpl = context.tpl + `
</el-row>`;
    } else if (p.type === 'array') {
      const itemKey = 'item' + level;
      const indexKey = 'index' + level;
      context.tpl = context.tpl + `
<el-row class="level_${level} array">
 <slot-com :defs="slotContent" :attrs="{parts}"
           :binds="{key: '${key}', partName: '${append.part.name}', process: '${append.CONFIG.process}', parts: parts, BASE_PATH:'${append.BASE_PATH}' }"
              name="array_before"></slot-com>
<template v-for="(${itemKey}, ${indexKey}) in ${basePath}" >`;
      if (p.items.type === 'object') {
        for (const [ key, value ] of Object.entries(p.items.properties)) {
          render(value, key, context, level + 1,
            `${basePath}[${indexKey}]['${key}']`, `${configPath}.items.properties['${key}']`);
        }
        // render(p.items, context, level + 1)
      }
      context.tpl = context.tpl + `
</template>
</el-row>`;
    } else {
      // console.log(p, key);
      context.tpl = context.tpl + `
<el-col class="level_${level} prop"
>`;
      context.tpl = context.tpl +
        `
<cm-field
v-model="${basePath}"
label="${key}" prop="${key}"
form-path="${basePath}"
type="${p.type}"
:ui="${configPath}.ui"
:rules="${configPath}.rules"
>
</cm-field>`;
      context.tpl = context.tpl + `
</el-col>`;
    }
  }

  render(p, '', context, 1, basePath, configPath);
  return context.tpl;
}

const { Controller } = require('egg');
class BaseController extends Controller {
  // eslint-disable-next-line no-useless-constructor
  constructor(ctx) {
    super(ctx);
  }
  BASE_renderForm(config, basePath, configPath, append) {
    append.BASE_PATH = basePath
    return renderForm(config, basePath, configPath, append);
  }
}

module.exports = BaseController;