import { createFormModel } from './public/formmodel.js';

const templateId = 'search-demo1-tpl';
// eslint-disable-next-line no-undef
globalThis.initTemplate(templateId, globalThis, {
  html: `{{html}}`,
});

export default {
  template: '#' + templateId,
  setup() {
    const { ref, reactive } = global.Vue;

    // const internalInstance = getCurrentInstance();

    const tableData = ref([]);

    // const configID = '{{ id }}';
    const config = JSON.parse(`{{source}}`);

    const obj = createFormModel(config.formDef);
    const model = reactive(obj);
    const formDef = config.formDef;

    console.log(config);

    return {
      formDef,
      model,
      tableData,
    };
  },
};
