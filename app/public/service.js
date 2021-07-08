export function install(Vue) {
  return {
    template: '<div></div>',
    setup() {
      function getArr() {
        console.log('value.value = props.modelValue', Vue)
      }
      return {
        getArr
      }
    }
  }
}
