const searchParams = new URL(import.meta.url).searchParams

export default {
  install(app) {
    const { ref } = window.Vue
    const instanceInput1 = searchParams.get('id');
    app.component('input1', {
      template: '#tpl-' + instanceInput1,
      setup(props, ctx) {
        const title = ref(props.counter)
        function onInput() {
          ctx.emit('update:title', title)
        }
        return {
          title,
          onInput
        }
      }
    });
  },
};
