__BEFORE__;

export default {
  install(app) {
    const { ref } = window.Vue;
    app.component('input2', {
      template: ENV.tplId,
      setup(props, ctx) {
        const username = ref(props.counter);
        function onInput() {
          ctx.emit('update:username', username);
        }
        return {
          username,
          onInput,
        };
      },
    });
  },
};
