import { global, lodash } from './public/expose/main.js';
import { useCommonComponent } from './public/hooks.js';

export default function(name) {
  const templateId = name + '-tpl';
  // eslint-disable-next-line no-undef
  globalThis.initTemplate(templateId, globalThis, {
    html: `{{html}}`,
  });

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
      context: null,
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
    },
    setup(props, { emit }) {
      const { ref, watch, nextTick, inject } = global.Vue;
      // let curFormCon = inject('curFormCon')
      // console.log(curFormCon, props)
      let context = props.context

      let lock = new ZY.Lock(/* optional lock name, should be unique */)

      const commonCom = useCommonComponent({ name });

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

      return {
        onInput,
        ...commonCom,
        getOpt,
        getUIOpt,
        onFchange,
        isArray,
        context,
        // onUpdateModelValue,
        value,
        onChange,
      };
    },
  };
}
