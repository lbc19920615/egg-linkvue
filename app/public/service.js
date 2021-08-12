export function install(Vue) {
  return {
    template: '<div></div>',
    setup() {
      async function getArr() {
        console.log('value.value = props.modelValue');
        return []
      }
      return {
        getArr,
      };
    },
  };
}
