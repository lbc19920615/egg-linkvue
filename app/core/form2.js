const { getStrIfIsNotEmpty, attrTOStr } = require('./utils');

const lodash = require('lodash');


function getPropField(p, basePath, key, pathArrStr, append) {
  const field_tag = getStrIfIsNotEmpty(p, 'ui.widget', 'van-field');

  let ret = `<${field_tag}
v-model="${basePath}"
label="${key}" 
@change="onSetProp([${append.BASE_FORM_KEY} ${pathArrStr}], $event)">
</${field_tag}>`;

  if (p.ui && p.ui.widgetFormat) {
      console.log(p.ui.widgetFormat, p.ui)
  }

  if (field_tag === 'van-field') {
    let afterStr = '';
    if (p.type === 'number' || p.type === 'integer') {
      const attrs = [
        [ 'type', 'number' ],
      ];
      afterStr = attrTOStr(attrs);
      console.log(afterStr);
    }
    ret = `<van-field
v-model="${basePath}"
label="${key}"
 ${afterStr}
@change="onSetProp([${append.BASE_FORM_KEY} ${pathArrStr}], $event)">
</van-field>`;
  }


  return ret;
}

module.exports = {
  getPropField,
};
