

import * as ZY from './expose/main.js';
// eslint-disable-next-line no-undef
globalThis.ZY = ZY;

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
