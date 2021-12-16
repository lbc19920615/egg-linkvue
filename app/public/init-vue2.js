const getGlobal = function() {
  // eslint-disable-next-line no-undef
  if (typeof self !== 'undefined') { return self; }
  // eslint-disable-next-line no-undef
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
const _global = getGlobal();
if (typeof _global.globalThis === 'undefined') {
  _global.globalThis = _global;
}

import * as ZY from './expose/main.js';
// eslint-disable-next-line no-undef
globalThis.ZY = ZY;

{
  const COMMON_EVAL_FUNS = {
    时间间隔(date1, date2) {
      /**
       * @param date1 {Date|string (Date format)} 结束日期
       * @param date2 {Date|string (Date format)} 开始日期
       * @returns {null|*}
       */
      if (date1 && date2) {
        return ZY.Time.subtract2Date(date1, date2).asHours();
      }
      return null;
    },
    取整(v, presion) {
      /**
       * @param v
       * @param presion
       * @returns {string|*}
       */
      const ret = ZY.lodash.floor(v, presion);
      // if (ret === 0) {
      //   return ''
      // }
      return ret;
    },
  };
  // eslint-disable-next-line no-undef
  if (typeof globalThis.COM_FORM_COMMON_EVAL_FUNS === 'undefined') {
    // eslint-disable-next-line no-undef
    globalThis.COM_FORM_COMMON_EVAL_FUNS = COMMON_EVAL_FUNS;
  }

}

import * as ZY_EXT from './expose/vue2.js';
// eslint-disable-next-line no-undef
globalThis.ZY_EXT = ZY_EXT;

// eslint-disable-next-line no-undef
globalThis.Z_FORM_TPL = ZY.getHereDoc(function() { /*
    <div class="http-com comformscr2">
  <template v-if="config.debug">{% verbatim %}{{ {% endverbatim %} parts {% verbatim %} }} {% endverbatim %}</template>
  {% for part in CONFIG.parts %}
  {% set partConfigKey = 'config.parts[' ~ loop.index0 ~ '].def' %}
  {% set pathKey = "parts." ~ part.name %}
  {% set pathSKey = "'parts." ~ part.name ~ "'" %}
  {% set modelKey = pathKey ~ ".model"  %}
    {% if part.type == 'form' %}
    <el-form class="z-form http-com-part http-com-part__{{ part.name }}"
             ref="comformscr2__{{ part.name }}" :model="{{ pathKey }}.model"
             {% for KeyValue in part.def.ui.attrs %} {{ KeyValue[0] }}="{{ KeyValue[1] }}"{% endfor %}
    >
      {{ partStr[part.name] }}
      <slot-com :defs="slotContent" :attrs="{parts}"
                :binds="{name: '{{ part.name }}', ctx: exportCtx,  partName: '{{ part.name }}', parts, process: '{{ CONFIG.process}}' }"
                name="form_afterend"></slot-com>
    </el-form>
    {% endif %}
  {% endfor %}
</div>
*/ });
