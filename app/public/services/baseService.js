export const baseServiceMixin = {
  data() {
    return {
      base: '',
    };
  },
};

export const baseServiceDef = ({vue, ctx}) => {
  const { defineComponent, reactive, effectScope, computed, getCurrentInstance, inject } = vue;
  const scope = effectScope();
  const globalStore = inject('globalStore')

  let model = {};
  const computedModel = {};

  function getModel() {
    return {
      model,
      computedModel,
    };
  }

  function initModel(modelDef = { plain: {}, computed: {} }) {
    scope.run(() => {
      model = reactive(modelDef.plain);

      for (const computedKey in modelDef.computed) {
        const fun = modelDef.computed[computedKey](model, computedModel);
        computedModel[computedKey] = computed(fun);
      }

      // watch(() => model.name, () => console.log(model, computedModel));

    });
    return getModel();
  }

  async function setModel(newVal) {
    // console.log(ZY.lodash.get(model, path));
    for (const key in newVal) {
      model[key] = newVal[key];
    }
  }
  return {
    initModel,
    getModel,
    setModel,
  };
};
