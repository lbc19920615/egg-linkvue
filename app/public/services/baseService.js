export const baseServiceMixin = {
  data() {
    return {
      base: '',
    };
  },
};

export const baseServiceDef = ({ vue }) => {
  const { defineComponent, reactive, effectScope, computed, getCurrentInstance, inject } = vue;
  const scope = effectScope();
  const globalStore = inject('globalStore');

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
      global.ZY.PubSub.publish(globalStore.EVENT_TYPES.INIT_MODEL_READY, '');
    });
    return getModel();
  }

  async function setModel(newVal) {
    // console.log(ZY.lodash.get(model, path));
    for (const key in newVal) {
      model[key] = newVal[key];
    }
    global.ZY.PubSub.publish(globalStore.EVENT_TYPES.SET_MODEL_READY, '');
  }
  return {
    initModel,
    getModel,
    setModel,
  };
};
