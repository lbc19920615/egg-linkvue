import { baseServiceDef, baseServiceMixin } from './baseService.js';

export function install(vue) {
  const { defineComponent } = vue;
  // const ZY = global.ZY;
  return defineComponent({
    template: '<div></div>',
    mixins: [
      baseServiceMixin,
    ],
    setup(props, ctx) {
      return baseServiceDef({props, ctx, vue});
    },
  });
}
