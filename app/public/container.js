const searchParams = new URL(import.meta.url).searchParams

export default {
  install(app) {
    const { ref } = window.Vue
    const instanceInput1 = searchParams.get('id');
    app.component('s-container', {
      template: '#tpl-' + instanceInput1,
      setup(props, ctx) {
        return {
        }
      }
    });
  },
};
