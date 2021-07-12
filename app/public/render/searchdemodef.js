import { createFormModel } from './public/formmodel.js';

export default {
  setup() {
    const { ref, getCurrentInstance, reactive } = global.Vue;

    // const internalInstance = getCurrentInstance();

    const tableData = ref([]);

    // const configID = '{{ id }}';
    const config = JSON.parse(`{{config}}`);

    console.log(config);

    const obj = createFormModel(config.source.formDef);
    const model = reactive(obj);
    const formDef = config.source.formDef;

    return {
      formDef,
      model,
      tableData,
    };
  },
};
