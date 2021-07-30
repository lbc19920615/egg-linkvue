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
      modelValue: null,
      ui: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    setup(props, { emit }) {
      const { ref, onMounted, watch } = global.Vue;

      const commonCom = useCommonComponent({ name });

      let value = ref('');
      if (props.type === 'checkbox') {
        value = ref([]);
      }
      if (props.type === 'time') {
        value = ref(new Date());
      }
      onMounted(() => {
        // value.value = props.modelValue;
        // if (props.type === 'time') {
        //   console.log(value.value)
        // }
        // setTimeout(() => {
        //   console.log('sdsds', props, props.modelValue);
        //   value.value = props.modelValue;
        // }, 30);
      });

      watch(() => props.modelValue, function(newVal) {
        // console.log('newVal', newVal)
        value.value = newVal;
      }, { immediate:true });

      function onInput() {
        // console.log('onInput', props.modelValue, e)
        // console.log('value.value', value.value)
        emit('update:modelValue', value.value);
      }

      function onChange(e) {
        console.log(e)
        emit('update:modelValue', value.value);
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

      return {
        onInput,
        ...commonCom,
        getOpt,
        getUIOpt,
        isArray,
        value,
        onChange,
      };
    },
  };
}
