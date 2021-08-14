export const baseServiceMixin = {
  data() {
    return {
      base: '',
    };
  },
};

export const baseServiceDef = ({ vue }) => {
  const { defineComponent, reactive, effectScope, computed, getCurrentInstance, inject, nextTick } = vue;
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

  function initModel(modelDef = { plain: {}, computed: {}, callback: {}, context: {} }) {
    scope.run(() => {
      model = reactive(modelDef.plain);

      for (const computedKey in modelDef.computed) {
        const fun = modelDef.computed[computedKey](model, {
          beforeBuild(key) {
            // console.log('beforeBuild', key, computedModel[key].value);
            const preValue = computedModel[key].value;
            nextTick(() => {
              // console.log('beforeBuild', key, computedModel[key].value);
              const nextValue = computedModel[key].value;
              if (modelDef.callback && modelDef.callback.onComputedChange) {
                modelDef.callback.onComputedChange(key, nextValue, preValue);
              }
            });
          },
          context: modelDef.context,
        });
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
