import { global, lodash, getHereDoc, initTemplate, JSON5, rid, Lock } from './public/expose/main.js';

export default function(name) {
  const templateId = name + '-tpl';
  const cm_field_html = getHereDoc(function() { /* {{html}}*/ });
  // console.log(cm_field_html);

  // eslint-disable-next-line no-undef
  // globalThis.initTemplate(templateId, globalThis, {
  //
  //   html: cm_field_html,
  // });

  initTemplate(templateId, global.document, {
    html: cm_field_html,
  });

  function getWidget2(widgetObj = {}) {
    return widgetObj;
  }

  return {
    name,
    template: '#' + templateId,
    props: {
      prop: String,
      label: String,
      type: String,
      formPath: String,
      parentModel: null,
      modelValue: null,
      part_key: String,
      context: null,
      selfpath: String,
      pathArr: Array,
      prop_config: Object,
      ui: {
        type: Object,
        default() {
          return {};
        },
      },
      rules: {
        type: Object,
        default() {
          return {};
        },
      },
      slotContent: null,
    },
    setup(props, { emit }) {
      const { ref, watch, provide, onBeforeUnmount } = global.Vue;
      // let curFormCon = inject('curFormCon')
      // console.log(props.slotContent);
      const context = props.context;
      const uuid = 'cm-field-' + rid();

      // const lock = new ZY.Lock(/* optional lock name, should be unique */);
      const lock = new Lock(/* optional lock name, should be unique */);

      // const commonCom = useCommonComponent({ name });

      let value = ref('');
      if (props.type === 'checkbox') {
        value = ref([]);
      }
      if (props.type === 'time') {
        value = ref(new Date());
      }

      watch(() => props.modelValue, function(newVal) {
        if (newVal !== value.value) {
          // console.log('newVal', newVal)
          value.value = newVal;
        }
      }, { immediate: true });

      function onInput() {
        // console.log('onInput', props.modelValue)
        // console.log('value.value', value.value)
        // emit('update:modelValue', value.value);
        if (!lock.isLocked) {
          lock.lock(() => {
            // console.log('sdsdsds', v)
            // ZY.PubSub.publish('value-change', v)
            emit('update:modelValue', value.value);
          }, 100);
        }

        // nextTick(() => {
        //   emit('update:modelValue', value.value);
        // });
      }

      function onChange() {
        // console.log(e);
        emit('update:modelValue', value.value);
      }

      function onFchange(e) {
        // console.log('fchange', context, props.parentModel, props.prop, e);
        if (context && context.forceUpdate) {
          context.forceUpdate(props.parentModel, props.prop, e);
        }
      }

      function isArray(v) {
        return Array.isArray(v);
      }

      function getOpt(path, defaultVal) {
        // console.log('props.ui', path, lodash.get(props.ui, path, defaultVal))
        return lodash.get(props.ui, path, defaultVal);
      }

      function getUIOpt(path, defaultVal) {
        // console.log('props.ui', path, lodash.get(props.ui, path, defaultVal))
        return lodash.get(props.ui, path, defaultVal);
      }

      // function onUpdateModelValue(v) {
      //   console.log('onUpdateModelValue', v)
      // }
      function replaceNbsps(str) {
        // eslint-disable-next-line no-undef
        const text = document.createElement('div');
        text.innerHTML = str;
        return text.textContent;
        // console.log(text.textContent)
        // const re = new RegExp('&nbsp;', 'gi');
        // return str.replace(re, ' ');
      }

      function getLabel() {
        const ret = props.ui && props.ui.label ? props.ui.label : props.label;
        // console.log('ui label', ret);
        return replaceNbsps(ret);
      }

      function showLabel() {
        if (props.ui && props.ui.hiddenLabel) {
          return false;
        }
        return true;
      }

      function getDesc() {
        const ret = props.ui && props.ui.desc ? props.ui.desc : '';
        // console.log('ui label', ret);
        return replaceNbsps(ret);
      }


      function getProp(pathArr = []) {
        let path = '';
        pathArr.forEach((item, index) => {
          if (index < 1) {
            path = item;
          } else {
            // console.log(item, typeof item)
            if (typeof item === 'number') {
              path = `${path}[${item}]`;
            } else {
              path = `${path}.${item}`;
            }
          }
        });
        return path;
      }

      function onBlur(e) {
        // console.log('onBlur', context)
        context.fireEvent('blur', e);
        context.fireEvent('cmfield:blur', e);
      }


      let cachedConfig = {};
      try {
        cachedConfig = JSON5.parse(JSON5.stringify(
          context.get_SELF_CONFIG()
        ));
        // console.log(cachedConfig)
      } catch (e) {
      //
      }

      function getContextCONFIG(path) {
        if (!path) {
          return cachedConfig;
        }
        // console.log(cachedConfig, path)
        return lodash.get(cachedConfig, path);
      }

      if (props.ui.widget2) {
        try {
          const def = getWidget2(JSON5.parse(props.ui.widget2));


          props.ui = Object.assign(props.ui, def.data);
          // console.log('widget2', def)
        } catch (e) {
        //
        }
      }
      if (props.ui.widgetConfig && props.ui.widgetExt) {
        try {
          const ___def = JSON5.parse(props.ui.widgetExt);
          props.ui.widgetConfig = Object.assign(props.ui.widgetConfig, ___def.data);
        } catch (e) {
        //
        }
      }
      // console.log(props)

      const widgetConfig2 = props.ui ? props.ui.widgetConfig : null;
      if (widgetConfig2 && widgetConfig2.common_state) {
        widgetConfig2[widgetConfig2.common_state] = widgetConfig2.common_state;
      }


      const ret = {
        onBlur,
        p_selfpath: props.selfpath,
        p_formpath: props.formPath,
        p_pathArr: props.pathArr,
        onInput,
        // ...commonCom,
        getOpt,
        getContextCONFIG,
        propConfig: props.prop_config,
        getLabel,
        showLabel,
        getDesc,
        cachedConfig,
        getUIOpt,
        widgetConfig2,
        onFchange,
        isArray,
        context,
        cmFieldUUID: uuid,
        getProp,
        formSlotContent: props.slotContent,
        part_key: props.part_key,
        // onUpdateModelValue,
        value,
        onChange,
      };

      provide('CurCmField', ret);

      if (!global.cmFieldContext) {
        global.cmFieldContext = new Map();
      }

      global.cmFieldContext.set(uuid, ret);


      onBeforeUnmount(() => {
        global.cmFieldContext.delete(uuid);
      });

      return ret;
    },
  };
}
