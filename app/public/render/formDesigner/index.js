import { formModel } from './public/expose/main.js';

const templateId = 'search-demo1-tpl';
// eslint-disable-next-line no-undef
globalThis.initTemplate(templateId, globalThis, {
  html: `{{html}}`,
});

export default {
  template: '#' + templateId,
  props: {
    modelValue: null,
  },
  mounted() {
    this.$emit('init', this);
  },
  setup(props) {
    const { ref, reactive, onMounted, watch } = global.Vue;

    // const internalInstance = getCurrentInstance();

    const tableData = ref([]);

    // const configID = '{{ id }}';
    const config = JSON.parse(`{{source}}`);

    const obj = formModel.createFormModel(config.row);
    // console.log(obj)
    const model = reactive(obj);


    function setModel(newVal) {
      console.log('formDesigner change')
      for (const key in newVal) {
        model[key] = newVal[key];
        // console.log(key, model[key], newVal[key])
      }
    }

    return {
      config,
      model,
      tableData,
      setModel,
    };
  },
};
