__BEFORE__;

export default {
  install(app) {
    const { ref } = window.Vue;
    const instanceInput1 = ENV.id;
    app.component('s-container', {
      template: ENV.tplId,
      // eslint-disable-next-line no-unused-vars
      setup(props, ctx) {
        return {
        };
      },
    });
  },
};
