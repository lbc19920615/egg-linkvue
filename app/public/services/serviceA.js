

export function install(vue) {
  const { defineComponent, watch, reactive, effectScope, computed, watchEffect } = vue;
  const ZY = global.ZY;
  return defineComponent({
    template: '<div></div>',
    setup() {
      const scope = effectScope();

      async function getArr() {
        console.log('value.value = props.modelValue', vue);
        return [];
      }

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

          watch(() => model.name, () => console.log(model, computedModel));

        });
        return getModel();
      }

      async function setModel(path, value) {
        // console.log(ZY.lodash.get(model, path));
        model[path] = value;
      }
      return {
        getArr,
        initModel,
        getModel,
        setModel,
      };
    },
  });
}
