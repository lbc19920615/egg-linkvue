// console.log(import.meta);

const searchParams = new URL(import.meta.url).searchParams
console.log(typeof searchParams.get('id'))

export default {
  install(app) {
    const instanceInput1 = searchParams.get('id');
    app.component('input1', {
      template: '#tpl-' + instanceInput1,
    });
  },
};
