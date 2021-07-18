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
      const { ref, onMounted } = global.Vue;

      const commonCom = useCommonComponent({ name });

      let value = ref(null);
      if (props.type === 'checkbox') {
        value = ref([]);
      }
      if (props.type === 'time') {
        value = ref(new Date());
      }
      onMounted(() => {
        // value.value = props.modelValue;
        if (props.type === 'time') {
          console.log(value.value)
        }
        // console.log('sdsds', props.modelValue);
      });

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

      return {
        onInput,
        ...commonCom,
        getOpt,
        isArray,
        value,
        onChange,
      };
    },
  };
}
