__BEFORE__;

export default {
  install(app) {
    const { ref } = window.Vue;
    const instanceInput1 = ENV.id;
    app.component('input1', {
      template: ENV.tplId,
      setup(props, ctx) {
        const title = ref(props.counter);
        function onInput() {
          ctx.emit('update:title', title);
        }
        return {
          title,
          onInput,
        };
      },
    });
  },
};
