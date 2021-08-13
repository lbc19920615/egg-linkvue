import { formModel } from './public/expose/main.js';

const templateId = 'form-designer-tpl';
// eslint-disable-next-line no-undef
globalThis.initTemplate(templateId, globalThis, {
  html: `{{html}}`,
});

export default {
  template: '#' + templateId,
  props: {
    modelValue: null,
  },
  emits: [
    'model:update',
  ],
  mounted() {
    this.$emit('init', this);
  },
  setup(props, { emit }) {
    const { ref, reactive, watch } = global.Vue;

    // const internalInstance = getCurrentInstance();

    const tableData = ref([]);

    // const configID = '{{ id }}';
    const config = JSON.parse(`{{source}}`);

    const obj = formModel.createFormModel(config.row);
    // console.log(obj)
    const model = reactive(obj);


    function setModel(newVal) {
      console.log('formDesigner setModel', newVal);
      for (const key in newVal) {
        model[key] = newVal[key];
        // console.log(key, model[key], newVal[key])
      }
    }

    watch(model, newVal => {
      // console.log('model.content', newVal)
      emit('model:update', newVal);
    });

    return {
      config,
      model,
      tableData,
      setModel,
    };
  },
};
