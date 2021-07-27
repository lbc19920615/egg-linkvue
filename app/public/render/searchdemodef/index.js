import { formModel } from './public/expose/main.js';

const templateId = 'search-demo-tpl';
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

    const obj = formModel.createFormModel(config.formDef);
    // console.log(obj)
    const model = reactive(obj);
    const formDef = config.formDef;


    function runAction(name) {
      if (name === 'search') {
        console.log('model', model);
      }
    }

    return {
      formDef,
      model,
      tableData,
      runAction,
    };
  },
};
